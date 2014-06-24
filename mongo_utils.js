/*!
 * Mongo db version v2.4.10
 * Mon Jun 23 17:11:20.504 git version: e3d78955d181e475345ebd60053a4738a4c5268a
 *
 * Includes Inheritance Tax Specific database queries
 * https://github.com/asaas/InheritanceTax
 * 
 * @Author :Laxmikant Gurnalkar
 * Date: Mon Jun 23 05:15:00 2014 +0530
 * ************************************************* 
 * To run this script :
 *  * From Unix/Shell   : $ mongo ihtx ihtx.updatedb.js
 *  * From Windows 		: $ c:\MongoDB\bin\mongo.exe ihtx ihtx.updatedb.js
 *  * From mongo shell :
 *       $ use ihtx
 *       $ load("/path/to/ihtx.update.js")         
 * **************************************************
 */

var _mongo = _mongo || {};
var use_db_name = dbname || "test";//"myDatabase";

_mongo.dbutils = {
	init:function(){
		var self =  this; 
		self.conn = new Mongo();
		self.db = this.conn.getDB( use_db_name );
		return function(){return self.db}()
	},
	listdbs:function(){
		var db = _mongo.dbutils.init();
		var listdbs = _mongo.dbutils.get_db_names(db.adminCommand('listDatabases'));
		printjson(listdbs)
	},
	get_db_names:function(databases){
		var dbs = databases["databases"];
		var arr = [];
		for (db in dbs){arr.push(dbs[db].name)}
		return arr;
	},
	create:function(collName, data){
		try {
			var data =  data || {};
			var db = _mongo.dbutils.init();
			db[collName].insert(data)
			return [true, "Record Created : "+JSON.stringify(data) ];
		} catch (e) {
			  return [false, "Record can not created :"+e.message];
		}
	},
	insert:function(collName, data){
		var result = _mongo.dbutils.create(collName, data);
		print(result[1]);
		return result[0];
	},
	update:function(collName, data, query){
		var query = query || {};
		var db = _mongo.dbutils.init();
		db[collName].update(query, 
				{ $set: data }, { upsert:false, multi: true  }); 
	},
	upsert:function(collName, data, query){
		var query = query || {};
		var db = _mongo.dbutils.init();
		db[collName].update(query, 
				{ $set: data}, {upsert:true, multi:true});
	},
	updateOne:function(collName, data, query){
		var query = query || {};
		var db = _mongo.dbutils.init();
		db[collName].update(query, 
				{ $set: data}, {upsert:false, multi:false}); 
	},
	remove:function(collName, query){
		var query = query || {};
		var db = _mongo.dbutils.init();
		db[collName].remove(query); 
	},
	count:function(query){
		return db[collName].count(query);
	}
};


function main(){
	var self = this;
	self = _mongo.dbutils; 
	// show dbs, show databases
	self.listdbs();

	// Create a collection instance with document.
	self.insert("t2", {"_id" : ObjectId("5063114bd386d8fadbd6b006"), "item" : "pen", "qty" : 14} );
	
	// Update a collection instance with document.
	self.update("t2", {"item" : "pencil", "qty" : 10}, {"_id" : ObjectId("5063114bd386d8fadbd6b006")});
	
	// Update OR Insert a collection instance with document.
	self.upsert("t3", {"item" : "glass", "qty" : 10}, {"_id" : ObjectId("5063114bd386d8fadbd6b006")});

	//Update OR Insert a collection instance with document.
	self.remove("t3", {"item" : "glass", "qty" : 10});
}
//Call main()
//main();