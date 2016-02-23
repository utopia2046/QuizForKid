export myModule = function() {
  var name = 'This is my module'
  var func = function(name) {
    console.log('hello' + name);
  }
  
  return func(name);
}
