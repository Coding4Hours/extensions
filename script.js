// script.js

document.addEventListener('DOMContentLoaded', function() {
  var enableBtn = document.getElementById('enableBtn');
  var disableBtn = document.getElementById('disableBtn');
  var manageBtn = document.getElementById('manageBtn');
  var infoBtn = document.getElementById('infoBtn');
  var quitBtn = document.getElementById('quitBtn');
  var extensionList = document.getElementById('extensionList');
  var extensionPage = document.getElementById('extensionPage');

  // Function to open Chrome Web Store page
  function openWebStore() {
    window.open('https://chrome.google.com/webstorex', '_blank');
  }

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
    console.log(`
chrome.management.getAll(function(extensions) {
  extensions.forEach(function(extension) {
    if (extension.id !== chrome.runtime.id && !extension.enabled) {
      chrome.management.setEnabled(extension.id, true);
    }
  });
  refreshExtensionList();
  openWebStore();
});
    `);
  });

  disableBtn.addEventListener('click', function() {
    console.log(`
chrome.management.getAll(function(extensions) {
  extensions.forEach(function(extension) {
    if (extension.id !== chrome.runtime.id && extension.enabled) {
      chrome.management.setEnabled(extension.id, false);
    }
  });
  refreshExtensionList();
  openWebStore();
});
    `);
  });

  manageBtn.addEventListener('click', function() {
    console.log(`
chrome.management.getAll(function(extensions) {
  var options = [];
  extensions.forEach(function(extension) {
    if (extension.id !== chrome.runtime.id) {
      options.push(extension.name);
    }
  });
  var choice = prompt("Choose an extension to manage:\\n" + options.join("\\n"));
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
          refreshExtensionList();
          openWebStore();
        }
      });
    }
  } else {
    alert('Invalid choice');
  }
});
    `);
  });

  infoBtn.addEventListener('click', function() {
    console.log(`
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

  console.log(extensionInfo);
});
    `);
  });

  quitBtn.addEventListener('click', function() {
    console.log(`
alert('Exiting extension manager.');
    `);
  });

  // Always open Chrome Web Store on load
  openWebStore();
});
