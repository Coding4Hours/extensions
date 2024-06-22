document.addEventListener('DOMContentLoaded', function() {
    var enableBtn = document.getElementById('enableBtn');
    var disableBtn = document.getElementById('disableBtn');
    var manageBtn = document.getElementById('manageBtn');
    var infoBtn = document.getElementById('infoBtn');
    var quitBtn = document.getElementById('quitBtn');
    var extensionList = document.getElementById('extensionList');
    var extensionPage = document.getElementById('extensionPage');

    // Function to refresh the list of installed extensions
    function refreshExtensionList() {
        chrome.management.getAll(function(extensions) {
            extensionList.innerHTML = '';
            extensions.forEach(function(extension) {
                if (extension.id !== chrome.runtime.id) {
                    var p = document.createElement('p');
                    p.textContent = extension.name;
                    extensionList.appendChild(p);
                }
            });
        });
    }

    // Event listeners for extension management actions

    enableBtn.addEventListener('click', function() {
        chrome.management.getAll(function(extensions) {
            extensions.forEach(function(extension) {
                if (extension.id !== chrome.runtime.id && !extension.enabled) {
                    chrome.management.setEnabled(extension.id, true);
                }
            });
            refreshExtensionList();
        });
    });

    disableBtn.addEventListener('click', function() {
        chrome.management.getAll(function(extensions) {
            extensions.forEach(function(extension) {
                if (extension.id !== chrome.runtime.id && extension.enabled) {
                    chrome.management.setEnabled(extension.id, false);
                }
            });
            refreshExtensionList();
        });
    });

    manageBtn.addEventListener('click', function() {
        chrome.management.getAll(function(extensions) {
            var options = [];
            extensions.forEach(function(extension) {
                if (extension.id !== chrome.runtime.id) {
                    options.push(extension.name);
                }
            });
            var choice = prompt("Choose an extension to manage:\n" + options.join("\n"));
            var selectedExtension = extensions.find(function(ext) {
                return ext.name === choice;
            });
            if (selectedExtension) {
                var action = selectedExtension.enabled ? 'disable' : 'enable';
                var confirmAction = confirm('Do you want to ' + action + ' the extension: ' + selectedExtension.name + '?');
                if (confirmAction) {
                    chrome.management.setEnabled(selectedExtension.id, !selectedExtension.enabled, function() {
                        if (chrome.runtime.lastError) {
                            console.error('Failed to ' + action + ' extension ' + selectedExtension.name + ': ' + chrome.runtime.lastError.message);
                        } else {
                            alert((action === 'enable' ? 'Enabled' : 'Disabled') + ' extension: ' + selectedExtension.name);
                            refreshExtensionList();
                        }
                    });
                }
            } else {
                alert('Invalid choice');
            }
        });
    });

    infoBtn.addEventListener('click', function() {
        chrome.management.getAll(function(extensions) {
            var extensionInfo = extensions.map(function(ext) {
                return {
                    "Name": ext.name,
                    "ID": ext.id,
                    "Enabled": ext.enabled ? "Yes" : "No",
                    "Version": ext.version,
                    "Description": ext.description,
                    "Homepage URL": ext.homepageUrl || "Not specified",
                    "Options URL": ext.optionsUrl || "Not specified",
                    "Permissions": ext.permissions.length > 0 ? ext.permissions.join(', ') : 'None',
                    "Type": ext.type,
                    "Install Type": ext.installType,
                    "May Disable": ext.mayDisable ? "Yes" : "No",
                    "May Enable": ext.mayEnable ? "Yes" : "No",
                    "Icons": ext.icons.map(function(icon) {
                        return {
                            "Size": icon.size,
                            "URL": icon.url
                        };
                    }),
                    "Host Permissions": ext.hostPermissions.length > 0 ? ext.hostPermissions.join(', ') : 'None',
                    "Update URL": ext.updateUrl || "Not specified",
                    "Offline Enabled": ext.offlineEnabled ? "Yes" : "No",
                    "Is App": ext.isApp ? "Yes" : "No",
                    "Disabled Reason": ext.disabledReason || "Not disabled"
                };
            });

            var infoMessage = "Extension Data:\n\n";
            extensionInfo.forEach(function(info, index) {
                infoMessage += "Extension " + (index + 1) + ":\n";
                infoMessage += "Name: " + info["Name"] + "\n";
                infoMessage += "ID: " + info["ID"] + "\n";
                infoMessage += "Enabled: " + info["Enabled"] + "\n";
                infoMessage += "Version: " + info["Version"] + "\n";
                infoMessage += "Description: " + info["Description"] + "\n";
                infoMessage += "Homepage URL: " + info["Homepage URL"] + "\n";
                infoMessage += "Options URL: " + info["Options URL"] + "\n";
                infoMessage += "Permissions: " + info["Permissions"] + "\n";
                infoMessage += "Type: " + info["Type"] + "\n";
                infoMessage += "Install Type: " + info["Install Type"] + "\n";
                infoMessage += "May Disable: " + info["May Disable"] + "\n";
                infoMessage += "May Enable: " + info["May Enable"] + "\n";
                infoMessage += "Icons:\n";
                info["Icons"].forEach(function(icon) {
                    infoMessage += "  Size: " + icon["Size"] + ", URL: " + icon["URL"] + "\n";
                });
                infoMessage += "Host Permissions: " + info["Host Permissions"] + "\n";
                infoMessage += "Update URL: " + info["Update URL"] + "\n";
                infoMessage += "Offline Enabled: " + info["Offline Enabled"] + "\n";
                infoMessage += "Is App: " + info["Is App"] + "\n";
                infoMessage += "Disabled Reason: " + info["Disabled Reason"] + "\n\n";
            });

            alert(infoMessage);
        });
    });

    quitBtn.addEventListener('click', function() {
        alert('Exiting extension manager.');
    });

    // Detect user agent and set the extension management page accordingly
    var userAgent = navigator.userAgent.toLowerCase();
    var extensionPageUrl = '';
    if (userAgent.includes('chromium')) {
        extensionPageUrl = 'https://chrome.google.com/webstore';
    } else if (userAgent.includes('chrome')) {
        extensionPageUrl = 'https://chrome.google.com/webstore';
    } else if (userAgent.includes('firefox')) {
        extensionPageUrl = 'https://addons.mozilla.org';
    } else {
        extensionPageUrl = 'https://chrome.google.com/webstore'; // Default to Chrome Web Store
    }
    extensionPage.src = extensionPageUrl;

    refreshExtensionList();
});
