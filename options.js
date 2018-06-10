"use strict";

class DataService {
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
	saveUserDefinedRules(rules){
		console.debug("saving user-defined rules.");
		return new Promise((resolve)=>{
			chrome.storage.sync.set({rules:rules},function(){
				console.debug("user-defined rules saved");
			});
		});
	}
	processRule(rule){
		rule.hostPattern=rule.host.replace(/[.*]/g,function(c){
			if(c==".")return "\\.";
			if(c=="*")return ".*?";
		});
		return rule;
	}
}

jQuery(function($){
	var dataService=new DataService();
	var isValidSelector=(function(){
		var df=document.createDocumentFragment();
		return function(s){
			try{
				df.querySelector(s);
				return true;
			}catch(e){
				return false;
			}
		};
	}());
	initBuiltInTable($,dataService,isValidSelector);
	initUserDefinedTable($,dataService,isValidSelector);
})

function initBuiltInTable($,dataService,isValidSelector){
	var builtInRules=[];
	var dataGrid={
		$table: $('#builtInRules'),
		$tbody: $('#builtInRules>tbody'),
		trTemplate: $('#builtInRuleTrTemplate')[0],
		renderRules: function(rules){
			var typicalTr=this.trTemplate.content.firstChild;
			var df=document.createDocumentFragment();
			rules.forEach(function(rule){
				var tr=typicalTr.cloneNode(true);
				tr.querySelector('td[axis="host"]').textContent=rule.host;
				tr.querySelector('td[axis="prev"]').textContent=rule.prev;
				tr.querySelector('td[axis="next"]').textContent=rule.next;
				tr.data=rule;
				df.appendChild(tr);
			});
			this.$tbody.empty().append(df);
		}
	};
	dataService.getBuiltInRules().then(function(rules){
		builtInRules=rules;
		dataGrid.renderRules(rules);
	});
}

function initUserDefinedTable($,dataService,isValidSelector){
	var userDefinedRules=[];
	var dataGrid={
		$table: $('#userDefinedRules'),
		$tbody: $('#userDefinedRules>tbody'),
		trTemplate: $('#userDefinedRuleTrTemplate')[0],
		renderRules: function(rules){
			var df=document.createDocumentFragment();
			var typicalTr=this.trTemplate.content.firstChild;
			rules.forEach(function(rule){
				var tr=typicalTr.cloneNode(true);
				tr.querySelector('td[axis="host"]').textContent=rule.host;
				tr.querySelector('td[axis="prev"]').textContent=rule.prev;
				tr.querySelector('td[axis="next"]').textContent=rule.next;
				tr.data=rule;
				df.appendChild(tr);
			});
			this.$tbody.empty().append(df);
		}
	};
	dataGrid.$tbody.on("click",'.btn-delete',function(){
		var $tr=$(this).closest('tr');
		var index=$tr.index();
		userDefinedRules.splice(index,1);
		dataService.saveUserDefinedRules(userDefinedRules);
		$tr.remove();
	});
	dataGrid.$table.find('.btn-add').on("click",function(){
		var $host=$('input[name="host"]');
		var $prev=$('input[name="prev"]');
		var $next=$('input[name="next"]');
		var host=$host.prop("value");
		if(!$host[0].reportValidity()){
			return;
		}
		var prev=$prev.prop("value");
		if(!isValidSelector(prev)){
			$prev[0].setCustomValidity("Invalid query selector");
		}else{
			$prev[0].setCustomValidity("");
		}
		if(!$prev[0].reportValidity()){
			return;
		}
		var next=$next.prop("value");
		
		if(!isValidSelector(next)){
			$next[0].setCustomValidity("Invalid query selector");
		}else{
			$next[0].setCustomValidity("");
		}
		if(!$next[0].reportValidity()){
			return;
		}
		
		var newRule=dataService.processRule({host:host,prev:prev,next:next});
		var oldRuleIndex=userDefinedRules.findIndex((rule)=>rule.host==newRule.host);
		if(oldRuleIndex>-1){
			if(confirm("Rule "+newRule.host+" already exists. update it?")){
				userDefinedRules[oldRuleIndex]=newRule;
			}else{
				return;
			}
		}else{
			userDefinedRules.push(newRule);
		}
		dataService.saveUserDefinedRules(userDefinedRules);
		dataGrid.renderRules(userDefinedRules);
	});
	dataService.getUserDefinedRules().then((rules)=>{
		userDefinedRules=rules;
		dataGrid.renderRules(userDefinedRules);
	});
}
