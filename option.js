let count = 0;

document.addEventListener('DOMContentLoaded', function() {
    const save = document.getElementById('save');
    save.addEventListener('click', saveEx);

    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    days.addEventListener("keyup", function() {
        if (!days.value || days.value < 0) {
            days.value = 0;
        } else if (days.value > 60) {
            days.value = 60;
        } else {
            days.value = parseInt(days.value, 10);
        }
    });

    hours.addEventListener("keyup", function() {
        if (!hours.value || hours.value < 0) {
            hours.value = 0;
        } else if (hours.value > 60) {
            hours.value = 60;
        } else {
            hours.value = parseInt(hours.value, 10);
        }
    });

    callOptions();
    listSavedCookie();

    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('titleModal').style.display = 'none';
    });
});

async function saveEx() {
    const domDay = document.getElementById('days');
    const domHour = document.getElementById('hours');
    const days = parseInt(domDay.value, 10);
    const hours = parseInt(domHour.value, 10);

    domDay.value = days;
    domHour.value = hours;

    if (isNaN(days) || isNaN(hours) || days < 0 || hours < 0) {
        alert('Please enter valid days and hours.');
        return;
    }

    const extendDuration = days * 24 * 60 * 60 + hours * 60 * 60;
    const ageYn = document.getElementById('ageYn').checked;
    const data = {age: extendDuration, ageYn: ageYn};

    chrome.storage.sync.set(data, function() {
        if (chrome.runtime.lastError) {
            showMsg(chrome.runtime.lastError);
        } else {
            showMsg('saved successfully');
        }

        callOptions();
    });
}

function callOptions() {
    chrome.storage.sync.get(['age', 'ageYn'], function(data) {
        if (chrome.runtime.lastError) {
            showMsg(chrome.runtime.lastError);
        } else {
            const age = data.age;
            const ageYn = data.ageYn;
            const days = Math.floor(age / (24 * 60 * 60));
            const hours = (age % (24 * 60 * 60))/ (60 * 60);

            document.getElementById('days').value = days;
            document.getElementById('hours').value = hours;
            document.getElementById('ageYn').checked = ageYn;
        }
    });
}

async function showMsg(massage) {
    const msg = document.getElementById('msg');
    msg.innerText = massage;
    count += 1;
    await sleep(1500);
    count -= 1;
    if (count === 0) msg.innerHTML = '&nbsp;';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function listSavedCookie() {
    const listCookie = document.getElementById('list-Cookie');
    const ul = listCookie.getElementsByTagName('ul')[0];
    ul.innerHTML = '';

    try {
        getList().then((items) => {
            for (const key in items) {
                const list = document.createElement('li');
                const item = items[key];
                list.textContent = item[0] + ' - ' + key;
                list.dataset.key = key;
                ul.appendChild(list);
                const delIcon = document.createElement('div');
                delIcon.classList.add('delete-icon');
                list.appendChild(delIcon);
                delIcon.addEventListener('click', function(event) {
                    event.stopPropagation();
                    const key = this.parentNode.dataset.key;
                    delDataByKey(key).then(() => listSavedCookie());
                });
            }

            const keys = Object.keys(items);

            document.querySelectorAll("#list-Cookie > ul > li").forEach(function(e) {
                e.addEventListener("click", function() {
                    document.getElementById('titleModal').style.display = 'block';
                    document.getElementById('titleInput').value = e.dataset.key;
                    document.getElementById('titleInput').dataset.key = e.dataset.key;
                });
            });

            const old_element = document.getElementById('saveTitleBtn');
            const new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);

            document.getElementById('saveTitleBtn').addEventListener('click', function() {
                const title = document.getElementById('titleInput').value;
                if (keys.includes(title)) {
                    alert('Already exists.');
                    return;
                }

                const key = document.getElementById('titleInput').dataset.key;

                renameKey(key, title, function(result) {
                    if (result) {
                        listSavedCookie();
                        document.getElementById('titleModal').style.display = 'none';
                    } else {
                        alert('Failed to save.');
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getList() {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, function(items) {
            resolve(items);
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
            resolve();
        });
    });
}

function renameKey(oldKey, newKey, callback) {
    // Retrieve the value from the old key
    chrome.storage.local.get(oldKey, function(result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            callback(false);
            return;
        }

        const value = result[oldKey];

        // Save the value under the new key
        const obj = {};
        obj[newKey] = value;
        chrome.storage.local.set(obj, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                callback(false);
                return;
            }

            // Remove the old key
            chrome.storage.local.remove(oldKey, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    callback(false);
                    return;
                }

                callback(true);
            });
        });
    });
}