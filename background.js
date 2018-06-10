"use strict";

class DataService{
	getBuiltInRules(){
		return fetch(chrome.extension.getURL("rules.json")).then((response)=>response.json());
	}
	getBuiltInRuleStates(){
		return new Promise((resolve)=>{
			chrome.storage.sync.get(["builtInRuleStates"],(result)=>{resolve(result.builtInRuleStates||{});});
		});
	}
	getUserDefinedRules(){
		return new Promise((resolve)=>{
			chrome.storage.sync.get(["rules"],(result)=>{resolve(result.rules||[]);});
		});
	}
	getFinalRules(){
		return Promise.all([this.getBuiltInRules(),this.getUserDefinedRules()]);
	}
	processRule(rule){
		rule.hostPattern=rule.host.replace(/[.*]/g,(c)=>c=="."?"\\.":c=="*"?".*?":"");
		return rule;
	}
}

var dataService=new DataService();

console.debug("initializing final rules.");
dataService.getFinalRules().then(initializeRules);

chrome.storage.onChanged.addListener(function(changes, namespace){
	if(namespace=="sync"){
		for (var key in changes) {
			var change = changes[key];
			if(key=="rules"){
				console.debug("detected of user-defined rules change, re-initializing final rules.");
				dataService.getFinalRules().then(initializeRules);
			}
		}
	}
});

function initializeRules(values){
	var builtInRules=values[0];
	var userDefinedRules=values[1];
	var rules=builtInRules.concat(userDefinedRules);
	rules.forEach(dataService.processRule);
	chrome.storage.local.set({rules:rules},()=>{
		//console.debug("final rules initialized.");
	});
}