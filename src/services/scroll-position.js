angular.module('duScroll.scrollPosition', ['duScroll.requestAnimation']).
factory('scrollPosition',
  function($document, $window, $rootScope, $timeout, requestAnimation) {
    var getScrollY = function() {
      return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    };

    var getScrollX = function() {
      return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    };

    var observers = [];
    var lastScrollY = getScrollY();
    var currentScrollY = 0;
    
    var executeCallbacks = function(){
      currentScrollY = lastScrollY;
      $rootScope.$emit('$duScrollChanged', currentScrollY);
      for(var i = 0; i < observers.length; i++){
        observers[i](currentScrollY);
      }
    };

    var onScroll = function(){
      lastScrollY = getScrollY();

      if(lastScrollY !== currentScrollY){
        requestAnimation(executeCallbacks);
      }
    };

    angular.element($document).on('scroll', onScroll);
    //Init
    executeCallbacks();
    //Redo init after reflows and initial anchor jump
    angular.element($window).on('load', function() {
      $timeout(executeCallbacks, 10);
    });

    var deprecationWarned = false;
    return {
      observe : function(cb){
        if(!deprecationWarned && console && console.warn) {
          console.warn('scrollPosition.observe is deprecated, use $rootScope.$on(\'$duScrollChanged\') instead');
          deprecationWarned = true;
        }
        observers.push(cb);
      }, 
      x: getScrollX, 
      y: getScrollY
    };
  }
);
