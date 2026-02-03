function SCORM_wrapper(scorm_core, forceAvailable) {
    this.core = scorm_core;

    function wrapDataValueMethod(methodName, wrapper, source){
       if(arguments.length >3){
            wrapper[methodName] = function() {
                source[methodName].apply(wrapper, arguments)
                return source[methodName].apply(source, arguments);
            }
        } else {
            wrapper[methodName] = function() {
                return source[methodName].call(wrapper);
            }
        }
    }

    function wrapServiceMethod(methodName, wrapper, source){
        wrapper[methodName]= function(){
            return source[methodName].apply(source,arguments);
        };
    }
    
    this.mirror = new Object();
    this.mirror.setDataValue = function(name,value){
        this[name] = value;
    };
    this.mirror.getDataValue = function(name){
        if(Object.hasOwn(this, name))
            return this[name];
        else
            return null;
    };
    wrapDataValueMethod("getLearnerID",this.mirror,this.core);
    wrapDataValueMethod("getLearnerName",this.mirror,this.core);
    wrapDataValueMethod("getScore",this.mirror,this.core);
    wrapDataValueMethod("getScoreMin",this.mirror,this.core);
    wrapDataValueMethod("getScoreMax",this.mirror,this.core);
    wrapDataValueMethod("getScoreRaw",this.mirror,this.core);
    wrapDataValueMethod("getSuspendData",this.mirror,this.core);

    this.getSCORMMirror = function(){
        return this.mirror;
    };

    this.setDataValue = function(name,value){
        this.mirror.setDataValue(name,value);
        this.core.setDataValue(name,value)
    };
    this.getDataValue = function(name){
        this.core.getDataValue(name);
    };
    if(forceAvailable){
        this.isAvailable = function (){
            return true;
        };
        this.findAPI = function(win) {
            return null;
        };
        this.getAPI = function() {
            return null;
        };
        this.initialize = function() {
            var result = "true";
            return result;
        };
        this.terminate = function() {
            var result = "true";
            return result;
        };
        this.commitData = function() {
            var result = "true";
            if(SiteAPI.isEnabled()){
                result = SiteAPI.commit();
            }
            return result;
        };
        this.getLastErrorCode = function() {
            return "";
        };
        this.displayErrorInfo = function(errCode) {
        };
        this.core.setDataValue = function(name, value) {
            var result = "true";
            if(SiteAPI.isEnabled()){
                result = SiteAPI.setDataValue(name, value);
            }
            return result;
        };
        this.core.getDataValue = function(name) {
            var result = null;
            if(SiteAPI.isEnabled()){
                result = SiteAPI.getDataValue(name);
            }
            return result;
        };

    } else {
        wrapServiceMethod("isAvailable",this,this.core);
        wrapServiceMethod("findAPI",this,this.core);
        wrapServiceMethod("getAPI",this,this.core);
        wrapServiceMethod("initialize",this,this.core);
        wrapServiceMethod("terminate",this,this.core);
        wrapServiceMethod("commitData",this,this.core);
        wrapServiceMethod("getLastErrorCode",this,this.core);
        wrapServiceMethod("displayErrorInfo",this,this.core);

    }

    wrapDataValueMethod("getLearnerID",this,this.core);
    wrapDataValueMethod("getLearnerName",this,this.core);
    wrapDataValueMethod("getScore",this,this.core);
    wrapDataValueMethod("setScore",this,this.core, true);
    wrapDataValueMethod("getScoreMin",this,this.core);
    wrapDataValueMethod("setScoreMin",this,this.core, true);
    wrapDataValueMethod("getScoreMax",this,this.core);
    wrapDataValueMethod("setScoreMax",this,this.core, true);
    wrapDataValueMethod("getScoreRaw",this,this.core);
    wrapDataValueMethod("setScoreRaw",this,this.core, true);
    wrapDataValueMethod("getSuspendData",this,this.core);
    wrapDataValueMethod("setSuspendData",this,this.core, true);
}
if (SCORM.isAvailable())
    SCORM = new SCORM_wrapper(SCORM,false);
else
    SCORM = new SCORM_wrapper(SCORM,true);
