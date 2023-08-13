const form = document.getElementById('control-row');
const input = document.getElementById('input');
const message = document.getElementById('message');
const title = document.getElementById('title');

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (tab?.url) {
		try {
			let url = new URL(tab.url);
			input.value = url.hostname;
		} catch {
			// ignore
		}
	}

	input.focus();
	listSavedCookie(input.value);
})();

form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
	event.preventDefault();

	clearMessage();

	let url = stringToUrl(input.value);
	if (!url) {
		setMessage('Invalid URL');
		return;
	}

	let message = await saveDomainCookies(url.hostname);
	setMessage(message);
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

async function saveDomainCookies(domain) {
	let cookiesDeleted = 0;
	try {
		let cookies = await chrome.cookies.getAll({ domain });

		if (cookies.length === 0) {
			return 'No cookies found';
		}

		saveCookie(cookies);
		listSavedCookie(domain);
	} catch (error) {
		return `Unexpected error: ${error.message}`;
	}

	return `Deleted ${cookiesDeleted} cookie(s).`;
}

function saveCookie(cookie) {
	let key = title.value;
	let data = {};
	data[key] = cookie;
	delCookieByKey(key);

	chrome.storage.local.set(data).then(() => {
		console.log('success');
		setMessage('success');
	});
}

// display saved cookie list
async function listSavedCookie(domain) {
	let listCookie = document.getElementById('list-Cookie');
	let ul = listCookie.getElementsByTagName('ul')[0];
	ul.innerHTML = '';

	try {
		const cookieList = await getSavedCookieList(domain);
		for (const key in cookieList) {
			let list = document.createElement('li');
			list.textContent = key + ' = ' + cookieList[key];
			ul.appendChild(list);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}


async function getSavedCookieList(domain) {
	return new Promise((resolve) => {
		chrome.storage.local.get(null, function(items) {
			var cookieList = {};
			var keys = Object.keys(items);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var value = items[key][0].domain;
				console.log(key + ' = ' + value);

				if (value === domain) {
					cookieList[key] = value;
				}
			}
			resolve(cookieList);
		});
	});
}

let newVar = chrome.storage.local.get();
function deleteCookie(cookie) {
	const protocol = cookie.secure ? 'https:' : 'http:';
	const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

	return chrome.cookies.remove({
		url: cookieUrl,
		name: cookie.name,
		storeId: cookie.storeId
	});
}

function delCookieByKey(key) {
	chrome.storage.local.remove(key, function() {
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
		}
	});
}

function setMessage(str) {
	message.textContent = str;
	message.hidden = false;
}

function clearMessage() {
	message.hidden = true;
	message.textContent = '';
}