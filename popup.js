const form = document.getElementById('control-row');
const currUrl = document.getElementById('currUrl');
const message = document.getElementById('message');
const title = document.getElementById('title');

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (tab?.url) {
		try {
			let url = new URL(tab.url);
			currUrl.value = url.origin;
		} catch {
			// ignore
		}
	}

	currUrl.focus();
	await listSavedCookie(currUrl.value);
})();

form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
	event.preventDefault();

	clearMessage();

	if (!title.value) {
		setMessage('Please enter a title');
		return;
	}

	let url = stringToUrl(currUrl.value);
	if (!url) {
		setMessage('Invalid URL');
		return;
	}

	let message = await saveDomainCookies(url.origin);
	if (!!message) setMessage(message);
}

function stringToUrl(input) {
	// Start with treating the provided value as a URL
	try {
		return new URL(input);
	} catch {
		// ignore
	}
	// If that fails, try assuming the provided input is an HTTP host
	try {
		return new URL('http://' + input);
	} catch {
		// ignore
	}
	// If that fails ¯\_(ツ)_/¯
	return null;
}

async function saveDomainCookies(url) {
	try {
		const cookies = await getCookies(url);
		await saveCookie(url, cookies);
		listSavedCookie(url);
	} catch (error) {
		return `Unexpected error: ${error.message}`;
	}
}

async function getCookies(url) {
return new Promise((resolve) => {
		chrome.cookies.getAll({url:url}, function(cookies) {
			resolve(cookies);
		});
	});
}

async function saveCookie(url, cookie) {
	if (!cookie.length) return;
	let key = title.value;
	let data = {};
	let urlData = [url];
	data[key] = urlData.concat(cookie);

	await delDataByKey(key); // 이제 삭제가 완료될 때까지 기다림
	try {
		await chrome.storage.local.set(data);
		console.log('success');
		setMessage('success');
	} catch (error) {
		console.error(error);
		setMessage('error');
	}
}

// display saved cookie list
async function listSavedCookie(url) {
	let listCookie = document.getElementById('list-Cookie');
	let ul = listCookie.getElementsByTagName('ul')[0];
	ul.innerHTML = '';

	try {
		const keyList = await getSavedCookieList(url);
		for (const key in keyList) {
			let list = document.createElement('li');
			list.textContent = keyList[key];
			list.dataset.key = keyList[key];
			ul.appendChild(list);

			list.addEventListener('click', function() {
				let key = this.dataset.key;
				clickList(key);
			});
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

async function clickList(key) {
	await delCookieByUrl(currUrl.value);
	await setCookieByKey(key);
	await listSavedCookie(currUrl.value);
}


async function getSavedCookieList(url) {
	return new Promise((resolve) => {
		chrome.storage.local.get(null, function(items) {
			var keyList = [];
			var keys = Object.keys(items);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var value = items[key];

				if (url === value[0]) {
					keyList.push(key);
				}
			}
			resolve(keyList);
		});
	});
}

async function deleteCookie(cookie) {
	const protocol = cookie.secure ? 'https:' : 'http:';
	const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

	return new Promise((resolve) => {
		chrome.cookies.remove({
			url: cookieUrl,
			name: cookie.name,
			storeId: cookie.storeId
		}, function() {
			resolve();
		});
	});
}

async function delCookieByUrl(url) {
	const cookies = await getCookies(url);

	for (const cookie of cookies) {
		await deleteCookie(cookie);
	}
}

async function setCookieByKey(key) {
	const items = await getCookieListByKey(key);
	const cookieList = items[key].slice(1);

	for (const cookie of cookieList) {
		setCookie(cookie);
	}
}

async function getCookieListByKey(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, function(items) {
			resolve(items);
		});
	});
}

async function setCookie(cookie) {
	return new Promise((resolve) => {
		console.log(cookie.name);
		console.log(cookie.expirationDate);
		chrome.cookies.set({
			url: currUrl.value,
			name: cookie.name,
			value: cookie.value,
			domain: cookie.domain,
			path: cookie.path,
			secure: cookie.secure,
			httpOnly: cookie.httpOnly,
			expirationDate: cookie.expirationDate,
			storeId: cookie.storeId
		}, function() {
			resolve();
		});
	});
}



async function delDataByKey(key) {
	return new Promise((resolve) => {
		chrome.storage.local.remove(key, function() {
			var error = chrome.runtime.lastError;
			if (error) {
				console.error(error);
			}
			resolve(); // 삭제가 완료되면 resolve 호출
		});
	});
}

function getAllLevelDomains(domain) {
	const domainParts = domain.split(".");
	const length = domainParts.length;
	let domains = [];
	for (let i = 2; i <= length; i++) {
		domains.push(domainParts.slice(-i).join("."));
	}

	return domains
}

function setMessage(str) {
	message.textContent = str;
	message.hidden = false;
}

function clearMessage() {
	message.hidden = true;
	message.textContent = '';
}