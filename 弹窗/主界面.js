console.log("Popup DOM fully loaded and parsed");

  function modifyDOM() {
      //You can play with your DOM here or check URL against your regex
      console.log('Tab script:');
      var 代码段节点 = document.body.getElementsByTagName('table')[0].outerHTML
      console.log(代码段节点);
      return [代码段节点];
  }

  //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
  chrome.tabs.executeScript({
      code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
  }, (results) => {
      //Here we have just the innerHTML and not DOM structure
      console.log('Popup script:')
      console.log(results[0]);
      document.body.innerHTML = results[0];
  });