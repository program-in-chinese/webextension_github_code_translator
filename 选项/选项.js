function 保存选项(e) {
  chrome.storage.sync.set({
    翻译关键词: document.querySelector("#翻译关键词").checked
  });
  e.preventDefault();
}

function 恢复选项() {
  chrome.storage.sync.get({
    翻译关键词: false
  }, function(结果) {
    document.querySelector("#翻译关键词").checked = 结果.翻译关键词;
  });
}

document.addEventListener('DOMContentLoaded', 恢复选项);
document.querySelector('#翻译关键词').addEventListener('change', 保存选项);