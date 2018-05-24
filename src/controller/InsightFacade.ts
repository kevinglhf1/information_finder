/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import JSZip = require('jszip');

import Log from "../Util";
import {stringify} from "querystring";
import {type} from "os";
//import * as fs from "fs";
let fs = require('fs');
let parse5 = require('parse5');
let http = require('http');
let Decimal = require('decimal.js');

interface building_name_address{
    short_name:string
    full_name:string
    address:string
}
interface room{
    rooms_fullname:string
    rooms_shortname:string
    rooms_number:string
    rooms_name:string
    rooms_address:string
    rooms_lat:number
    rooms_lon:number
    rooms_seats:number
    rooms_type:string
    rooms_furniture:string
    rooms_href:string
}


var map = new Map();

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }


    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        var list_objects: any[] = [];
        var promises: any[] = []; //index
        var promises_LatLon: any[] = []; //latlon
        var promises_html: any[] = []; //rooms
        var list_room_objects: any[] = []; // all room
        var list_building_objects: any[] = []; //buildings in index
        var list_latlon:any[] = []; //latlon with building name
        return new Promise(function (fulfill,reject) {
            var new_zip = new JSZip();
            var inMemory = false;
            var onDisk = false;
            var haveFolder = false;
            if(map.has(id)){
                inMemory = true;
            }
            fs.readFile('/testZIPfolder/'+id+'.json', function(err:any,buffer:any){
                onDisk = !err;
            });

            if (id === 'rooms') {
                new_zip.loadAsync(content, {base64: true}).then(function (contentinzip: any) {
                    gotoIndex(contentinzip);
                    Promise.all(promises).then(function() {
                        getLatLon();
                        Promise.all(promises_LatLon).then(function() {
                            // Log.trace('list_latlon length is: ' + list_latlon.length);
                            getAllRooms(contentinzip);
                            //Promises_html_function();
                            callPoromisesAllforALLRooms();
                        }).catch(function(){
                            reject({code: 400, body: {'error': "getallrooms is wrong"}});
                        })
                    }).catch(function(){
                        reject({code: 400, body: {'error': "getlatlon is wrong"}});
                    })

                }).catch(function (error) {
                    //   Log.trace('getindex is wrong');
                    reject({code: 400, body: {'error': "getlatlon is wrong"}});
                })

            }

            else if (id === 'courses' || id.substring(0,8) ==='testtest'){
                //Log.trace('id is:' + id.substring(0,8));
                addForCourses();

            }
            else{
                reject({code: 400, body: {'error': "id is wrong"}});
            }

            function getLatLon():void{
                for(let b of list_building_objects){
                    var temp_address = b['address'].split(' ').join('%20');
                    temp_address = 'http://skaha.cs.ubc.ca:11316/api/v1/team127/'.concat(temp_address);
                    promises_LatLon.push(new Promise(async function(fulfill_L,reject_L){
                        //  Log.trace("url is:" +temp_address);
                        http.get(temp_address,(response:any)=>{
                            let data = '';
                            response.on('data',(chunk:any)=>{
                                data += chunk;
                            });
                            response.on('end',()=>{
                                data = JSON.parse(data);
                                var my_object :any = {};
                                my_object[b['short_name']] = data;
                                list_latlon.push(my_object);
                                fulfill_L();
                            })
                        });
                    }))
                }


            }


            function gotoIndex(contentinzip: any):void{
                contentinzip.forEach(function (path: string, file: any) {
                    promises.push(new Promise(function(fulfill00,reject00){
                        if (path === 'index.htm') {
                            contentinzip.file(path).async('string').then(function (htmlcontent: any) {
                                let document = parse5.parse(htmlcontent.toString());
                                getValidBuildings(document);
                                fulfill00();
                            }).catch(function (error00: any) {
                            });
                        }
                        else{
                            fulfill00();}
                    }))

                })}

            function callPoromisesAllforALLRooms():void{
                Promise.all(promises_html).then(function () {
                    if (list_room_objects.length === 0) {
                        reject({code: 400, body: {'error': 'There is no valid JSON file'}});
                    }
                    map.set(id, list_room_objects);
                    // Log.trace("Put object list into memory." );
                    try {
                        if (!fs.existsSync('./testZIPfolder')) {
                            fs.mkdirSync('./testZIPfolder');
                        }
                        fs.writeFileSync('./testZIPfolder/' + id + '.json', JSON.stringify(list_room_objects), 'utf8');
                        // Log.trace("Put JSON list onto disk");
                    } catch (err0) {
                        // Log.trace("Cannot write file to disk!!!" + err0);
                        reject({code: 400, body: {'error': 'lost'}});
                    }
                    if (!onDisk && !inMemory) {
                        fulfill({code: 204, body: {}});
                    }
                    else if (onDisk || inMemory) {
                        fulfill({code: 201, body: {}});
                    }
                    else {
                        //fulfill({code:201,body:{}});
                        reject({code: 400, body: {'error': 'lost'}});
                    }
                })
            }


            function getAllRooms(contentinzip:any):void {
                for (let oneBuilding in contentinzip.files) {
                    if (oneBuilding.toString().substring(oneBuilding.length - 9, oneBuilding.length) !== '.DS_Store' && oneBuilding.toString() !== 'index.htm' && !contentinzip.files[oneBuilding].dir){
                        promises_html.push(new Promise(function (fulfill2, reject2) {
                            let building_name = oneBuilding.split('/')[oneBuilding.split('/').length-1];
                            //Log.trace('building name is' + building_name);
                            let isValidBuilding = false;
                            for (let b of list_building_objects){
                                if (b['short_name'] === building_name){
                                    isValidBuilding = true;
                                }
                            }
                            if (!isValidBuilding){
                                fulfill2();
                                return;
                            } else {
                                //   Log.trace("valid path is " + oneBuilding);
                                contentinzip.file(oneBuilding).async('string').then(function (data: any) {
                                    // var document = parse5.parse(data.toString(),{treeAdapter:parse5.treeAdapters.default});
                                    let document = parse5.parse(data.toString());
                                    getRoomObject(document,building_name);
                                    fulfill2();
                                }).catch(function (error0: any) {
                                    reject2({code: 400, body: {'error': 'fail to load html file'}});
                                })
                            }
                        }))
                    }
                }
            }

            function getRoomObject(doc:any,building_name:String):void{
                if (building_name === 'UCLL'){
                    let tbody = doc.childNodes[6].childNodes[3].childNodes[31].childNodes[12].childNodes[1].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[3].childNodes[1].childNodes[3];
                    for(let t of tbody.childNodes) {
                        if (t['nodeName'] === 'tr') {
                            list_room_objects.push(getoneRoom(t.childNodes,building_name));
                        }
                    }
                } else {
                    if (doc.childNodes[6].childNodes[3].childNodes[31].childNodes[10].childNodes[1].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes.length === 1) {
                        return;
                    }

                    let tbody = doc.childNodes[6].childNodes[3].childNodes[31].childNodes[10].childNodes[1].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[3].childNodes[1].childNodes[3];
                    for (let t of tbody.childNodes) {
                        if (t['nodeName'] === 'tr') {
                            list_room_objects.push(getoneRoom(t.childNodes,building_name));
                        }
                    }
                }
            }

            function getoneRoom(t:any,short_name:any):any{
                let room_object:room={
                    rooms_fullname:null,
                    rooms_shortname:null,
                    rooms_number:null,
                    rooms_name:null,
                    rooms_address:null,
                    rooms_lat:0,
                    rooms_lon:0,
                    rooms_seats:0,
                    rooms_type:null,
                    rooms_furniture:null,
                    rooms_href:null,
                }
                for (let o of list_building_objects) {
                    if (short_name === o['short_name']) {
                        room_object['rooms_fullname'] = o['full_name'];
                    }
                }
                room_object['rooms_shortname'] = short_name;
                room_object['rooms_number'] = t[1].childNodes[1].childNodes[0]['value'].trim();
                room_object['rooms_name'] =  room_object['rooms_shortname'] + '_'+ room_object['rooms_number'];
                for (let o of list_building_objects) {
                    if (short_name === o['short_name']) {
                        room_object['rooms_address'] = o['address'];
                    }
                }
                for(let l of list_latlon){
                    if(Object.keys(l)[0] === short_name){
                        room_object['rooms_lat'] = l[short_name]['lat'];
                        room_object['rooms_lon'] = l[short_name]['lon'];
                    }
                }
                room_object['rooms_seats'] = Number((t[3].childNodes[0]['value'].trim()));
                room_object['rooms_type'] = t[7].childNodes[0]['value'].trim();
                room_object['rooms_furniture'] = t[5].childNodes[0]['value'].trim();
                room_object['rooms_href'] = t[1].childNodes[1].attrs[0]['value'].trim();
                return room_object;
            }


            function getValidBuildings(doc:any):void {
                let tbody = doc.childNodes[6].childNodes[3].childNodes[31].childNodes[10].childNodes[1].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[3];
                let childNode = tbody.childNodes;
                for(let k of childNode){
                    if(k['nodeName'] === 'tr'){
                        list_building_objects.push(getObject(k));
                    }
                }
            }
            function getObject(doc:any):any{
                let building_object:building_name_address= {
                    short_name:null,
                    full_name:null,
                    address:null,
                }
                let childNode = doc['childNodes'];
                let counter = 0;
                building_object['short_name'] = childNode[3].childNodes[0]['value'].trim();
                building_object['address'] = childNode[7].childNodes[0]['value'].trim();
                building_object['full_name'] = childNode[5].childNodes[1].childNodes[0]['value'];
                return building_object;
            }

            function addForCourses(){
                try {
                    new_zip.loadAsync(content, {base64: true}).then(function (zips: any) {
                        for (let zipFile in zips.files) {
                            if (!zips.files[zipFile].dir) {
                                promises.push(new Promise(function (fulfill2, reject2) {
                                    zips.file(zipFile).async("string").then(function (data: any) {
                                        // Log.trace("Put JSON data onto the list" );
                                        try {
                                            var temp = JSON.parse(data);
                                            let result = temp['result'];
                                            if (result.length === 0) {
                                                fulfill2();
                                            }
                                            for (let r of result) {
                                                if (r.hasOwnProperty('Course')) {
                                                    list_objects.push(r);
                                                }
                                            }
                                            fulfill2();
                                        } catch (err) {
                                            fulfill2();
                                        }
                                    })
                                }))
                            }
                        }
                        Promise.all(promises).then(function () {
                            if (list_objects.length === 0) {
                                reject({code: 400, body: {'error': 'There is no valid JSON file'}});
                            }
                            map.set(id, list_objects);
                            // Log.trace("Put object list into memory." );
                            try {
                                if (!fs.existsSync('./testZIPfolder')) {
                                    fs.mkdirSync('./testZIPfolder');
                                }
                                fs.writeFileSync('./testZIPfolder/' + id + '.json', JSON.stringify(list_objects), 'utf8');
                                // Log.trace("Put JSON list onto disk");
                            } catch (err0) {
                                // Log.trace("Cannot write file to disk!!!" + err0);
                                reject({code: 400, body: {'error': 'lost'}});
                            }
                            if (!onDisk && !inMemory) {
                                fulfill({code: 204, body: {}});
                            } else if (onDisk || inMemory) {
                                fulfill({code: 201, body: {}});
                            } else {
                                //fulfill({code:201,body:{}});
                                reject({code: 400, body: {'error': 'lost'}});
                            }
                        })
                        //.catch(function (err1) {
                        //reject({code:400,body:{'error':'lost'}});})
                    }).catch(function (err10) {
                        reject({code: 400, body: {'error': 'NotValidZip'}});
                    })

                } catch (err3) {
                    //Log.trace("Cannot save the file!!!" + err3);
                    reject({code: 400, body: {'error': 'cannot save'}});
                }
                // }catch(err2) {
                //     reject({code:400,body:{'error':'wjam am i'}});}
            }
        });
    }


    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            if(map.has(id)){
                map.delete(id);
            }
            fs.readFile("./testZIPfolder/" + id + ".json",function (err:boolean) {
                if(err){
                    // Log.trace("There is no such file with id on disk.");
                    reject({code:404,body:{'error': 'Try to delete non-exist file'}});
                }else{
                    fs.unlink("./testZIPfolder/" + id + ".json",function (err1:boolean) {
                        if(err1) { reject({code: 404, body: {'error': 'fail to unlink'}});
                        }else{fulfill({code: 204, body: {}});}});
                }
            })
        });
    }

    performQuery(query: any): Promise <InsightResponse> {
        let parsedQuery: any = null;
        let whereResultArray: any[]=[];
        let that = this;
        Log.trace("Start the method of performQuery");
        return new Promise(function (fullfill, reject) {

            try {
                parsedQuery = JSON.parse(JSON.stringify(query));
            }catch (err){
                //Log.trace("The JSON is invalid");
                reject({code: 424, body: {}});
            }

            // check the validity of the query

            var coursesOrRooms:string;
            var keyTOCheckForCoursesOrRooms: any[]=[];
            var keyToCheckInAPPLY: any[]=[];
            var keyToCheckInGroup: any[]=[];
            var keyInGroup: any[]=[];
            var keyInApply: any[]=[];
            var haveTransformation = false;
            if(!isValidQuery(parsedQuery)){
                reject({code: 400, body: {}});
            }
            // Check all key with "_" to see if they are all courses or rooms
            if(keyTOCheckForCoursesOrRooms[0].startsWith("courses_")){
                coursesOrRooms = "courses";
                for(var key of keyTOCheckForCoursesOrRooms){
                    if(!key.startsWith("courses_")){
                        reject({code: 400, body: {}});
                    }
                }
            }else {
                coursesOrRooms = "rooms";
                for(var key of keyTOCheckForCoursesOrRooms){
                    if(!key.startsWith("rooms_")){
                        reject({code: 400, body: {}});
                    }
                }
            }
            if(haveTransformation){
                // Check keys in Columns to see if they all appears in GROUP
                for(var temp of keyToCheckInGroup){
                    if(keyInGroup.indexOf(temp) <0){
                        reject({code: 400, body: {}});
                    }
                }
                // Check keys in Columns to see if they all appears in APPLY
                for (var temp of keyToCheckInAPPLY){
                    if(keyInApply.indexOf(temp) <0){
                        reject({code: 400, body: {}});
                    }
                }
            }

            // finally start the process of performing
            let coursesOrRoomsRowData: any;
            if(!map.has(coursesOrRooms)) {
                try {
                    coursesOrRoomsRowData = fs.readFileSync('/testZIPfolder/courses.json', 'utf8');
                    //Log.trace("Check the data on disk, and it turns out to be on disk.");
                } catch (err) {
                    //Log.trace("Check the data on disk, and it is not on disk.");
                    reject({code: 424, body: {}})
                }
                try {
                    coursesOrRoomsRowData = JSON.parse(JSON.stringify(coursesOrRoomsRowData));
                    //Log.trace("The courses.json is successfully parsed into memory.")
                } catch (err) {
                    //Log.trace("Should not be here...")
                    reject({code: 424, body: {}})
                }
            }else{
                coursesOrRoomsRowData = map.get(coursesOrRooms);
            }

            // change year
            if(coursesOrRooms == "courses"){
                for(let curr of coursesOrRoomsRowData){
                    if(curr["Section"] === "overall"){
                        curr["Year"] = "1900";
                    }
                }
            }

            // push object that satisfy where into whereResultArray
            let queryKeys = Object.keys(parsedQuery);
            let whereObject = parsedQuery['WHERE'];
            for(let index in coursesOrRoomsRowData){
                let course = coursesOrRoomsRowData[index];
                if(Object.keys(whereObject).length === 0){
                    whereResultArray.push(course);
                }else{
                    if(filtersPass(course,whereObject)){
                        whereResultArray.push(course);
                    }
                }
            }

            // push object that satisfy option into optionResultArray
            let optionsObject = parsedQuery['OPTIONS'];
            let groupOBJ : {[key:string]: any} = {};
            let transformationObject: any;
            if(haveTransformation){
                transformationObject = parsedQuery['TRANSFORMATIONS'];
                createGroupOBJECT(transformationObject);
                let columnsWanted2 = optionsObject["COLUMNS"];
                whereResultArray = modifyOnColumnsAccordingToTransformation(columnsWanted2,transformationObject);
            }
            let optionResultArray = sortByOptions(optionsObject);

            fullfill({code: 200, body: {result: optionResultArray}});


            //
            // Helpersssss...
            //

            function isValidM_Key(m_key:any):boolean{
                return (['courses_avg','courses_pass','courses_fail','courses_audit','courses_year','rooms_lat','rooms_lon','rooms_seats'].indexOf(m_key)>=0);
            }

            function isValidS_Key(s_key:any):boolean{
                return (['courses_dept','courses_id', 'courses_instructor','courses_title','courses_uuid','rooms_fullname','rooms_shortname',
                    'rooms_number','rooms_name','rooms_address','rooms_type','rooms_furniture','rooms_href'].indexOf(s_key)>=0);
            }

            function isValidDIR(direction:any):boolean{
                return (['UP','DOWN'].indexOf(direction)>=0);
            }

            function isValidApplyToken(applyToken:any):boolean{
                return (['MAX','MIN','AVG','COUNT','SUM'].indexOf(applyToken)>=0);
            }

            function sortByOptions(optionsObject: any): any[]{
                let keysInOptions = Object.keys(optionsObject);
                let columnsWanted = optionsObject[keysInOptions[0]];
                let orderWanted = optionsObject[keysInOptions[1]];
                if(!haveTransformation){
                    whereResultArray = modifyOnColumnsWithNoTransformation(columnsWanted);
                }
                if(keysInOptions.length !== 1){
                    if(typeof orderWanted === "string"){
                        whereResultArray.sort(function (a,b) {
                            return a[orderWanted] - b[orderWanted];
                        })
                    }else{
                        if(orderWanted["dir"] === "UP"){
                            var i = 0;
                            var orderkey = orderWanted['keys'];
                            whereResultArray.sort(function (a,b) {
                                while (i < orderkey.length) {
                                    var value1 = a[orderkey[i]];
                                    var value2 = b[orderkey[i]];
                                    if (value1 < value2) {
                                        return -1;
                                    }
                                    if (value1 > value2) {
                                        return 1;
                                    }
                                    else
                                        i++;
                                }
                                return 0;
                            });
                        }else if (orderWanted['dir'] === 'DOWN') {
                            var i = 0;
                            var orderkey = orderWanted["keys"];
                            whereResultArray.sort(function (a,b) {
                                while (i < orderkey.length) {
                                    var value1 = a[orderkey[i]];
                                    var value2 = b[orderkey[i]];
                                    //   Log.trace("value1,2down"+value1+ value2)
                                    if (value1 < value2) {
                                        return 1;
                                    }
                                    if (value1 > value2) {
                                        return -1;
                                    }
                                    else
                                        i++;
                                }
                                return 0;
                            })
                        }
                    }
                }
                return whereResultArray;

            }

            function modifyOnColumnsAccordingToTransformation(columnsWanted2:any,transformationObject:any):any[]{
                let applyRHS = transformationObject["APPLY"];
                let result: any[]=[];
                let obj : {[key:string]: any} = {};
                if(coursesOrRooms === "courses"){
                    obj = {};
                    let groupOBJkeys = Object.keys(groupOBJ);
                    for(let oneGroupOBJkeys of groupOBJkeys){
                        let value:any[] =[];
                        value = groupOBJ[oneGroupOBJkeys];
                        for(let oneColumn of columnsWanted2){
                            let valueToStore:any;
                            if(isValidM_Key(oneColumn) || isValidS_Key(oneColumn)){
                                obj[oneColumn] = findKEY(value[0],oneColumn);
                            }else {
                                for(let singleObj of applyRHS){
                                    if(oneColumn === Object.keys(singleObj)[0]){
                                        let applyTokenObj = singleObj[oneColumn];
                                        valueToStore = findValueCorrespondingly(applyTokenObj,value);
                                        obj[oneColumn] = valueToStore;
                                    }
                                }
                            }
                        }
                        result.push(obj);
                        obj={};
                    }
                }else{
                    obj = {};
                    let groupOBJkeys = Object.keys(groupOBJ);
                    for(let oneGroupOBJkeys of groupOBJkeys){
                        let value:any[] =[];
                        value = groupOBJ[oneGroupOBJkeys];
                        for(let oneColumn of columnsWanted2){
                            let valueToStore:any;
                            if(isValidM_Key(oneColumn) || isValidS_Key(oneColumn)){
                                obj[oneColumn] = value[0][oneColumn];
                            }else {
                                for(let singleObj of applyRHS){
                                    if(oneColumn === Object.keys(singleObj)[0]){
                                        let applyTokenObj = singleObj[oneColumn];
                                        valueToStore = findValueCorrespondingly(applyTokenObj,value);
                                        obj[oneColumn] = valueToStore;
                                    }
                                }
                            }
                        }
                        result.push(obj);
                        obj={};
                    }
                }
                return result;
            }

            function findValueCorrespondingly(applyTokenObj:any,arrayOfCourses:any):any{
                let keyssss = Object.keys(applyTokenObj);
                let actualToken = keyssss[0];
                let actualTokenRHS = applyTokenObj[actualToken];
                switch (actualToken){
                    case "MAX":
                        return findMAXValue(arrayOfCourses,actualTokenRHS);
                    case "MIN":
                        return findMINValue(arrayOfCourses,actualTokenRHS);
                    case "AVG":
                        return findAVGValue(arrayOfCourses,actualTokenRHS);
                    case "COUNT":
                        return findCOUNTValue(arrayOfCourses,actualTokenRHS);
                    case "SUM":
                        return findSUMValue(arrayOfCourses,actualTokenRHS);
                }
            }

            function findAVGValue(arrayOfCourses:any, actualTokenRHS:any):any{
                let result:any[]=[];
                for(let index in arrayOfCourses){
                    if(coursesOrRooms === "courses"){
                        result.push(findKEY(arrayOfCourses[index],actualTokenRHS));
                    }else {
                        result.push(arrayOfCourses[index][actualTokenRHS]);
                    }
                }
                let avg: number = Number((result.map((val:any) => <any>new Decimal(val)).reduce((a:any,b:any) => a.plus(b)).toNumber() /result.length).toFixed(2));
                return avg;
            }

            function findSUMValue(arrayOfCourses:any, actualTokenRHS:any):any{
                let result:any[]=[];
                for(let index in arrayOfCourses){
                    if(coursesOrRooms === "courses"){
                        result.push(findKEY(arrayOfCourses[index],actualTokenRHS));
                    }else {
                        result.push(arrayOfCourses[index][actualTokenRHS]);
                    }
                }
                let sum: number = Number(result.map((val:any) => <any>new Decimal(val)).reduce((a:any,b:any) => a.plus(b)).toNumber().toFixed(2));
                return sum;
            }

            function findCOUNTValue(arrayOfCourses:any, actualTokenRHS:any):any{
                let result:any[]=[];
                if(coursesOrRooms === "courses"){
                    result.push(findKEY(arrayOfCourses[0],actualTokenRHS));
                }else{
                    result.push(arrayOfCourses[0][actualTokenRHS]);
                }
                for(let index in arrayOfCourses){
                    if(coursesOrRooms === "courses"){
                        let temp = findKEY(arrayOfCourses[index],actualTokenRHS);
                        if(result.indexOf(temp) <0){
                            result.push(temp);
                        }
                    }else {
                        let temp = arrayOfCourses[index][actualTokenRHS];
                        if(result.indexOf(temp)<0){
                            result.push(temp);
                        }
                    }
                }
                return result.length;
            }

            function findMINValue(arrayOfCourses:any, actualTokenRHS:any):any{
                let result;
                if(coursesOrRooms === "courses"){
                    result = findKEY(arrayOfCourses[0],actualTokenRHS);
                }else{
                    result = arrayOfCourses[0][actualTokenRHS];
                }
                let temp = 0;
                for(let index in arrayOfCourses){
                    if(coursesOrRooms === "courses"){
                        temp = findKEY(arrayOfCourses[index],actualTokenRHS);
                    }else {
                        temp = arrayOfCourses[index][actualTokenRHS];
                    }
                    if(temp<result){
                        result = temp;
                    }
                }
                return result;
            }

            function findMAXValue(arrayOfCourses:any, actualTokenRHS:any):any{
                let result;
                if(coursesOrRooms === "courses"){
                    result = findKEY(arrayOfCourses[0],actualTokenRHS);
                }else{
                    result = arrayOfCourses[0][actualTokenRHS];
                }
                let temp = 0;
                for(let index in arrayOfCourses){
                    if(coursesOrRooms === "courses"){
                        temp = findKEY(arrayOfCourses[index],actualTokenRHS);
                    }else {
                        temp = arrayOfCourses[index][actualTokenRHS];
                    }
                    if(temp>result){
                        result = temp;
                    }
                }
                return result;
            }

            function createGroupOBJECT(transformationObj:any):any{
                let keysInTransformation = Object.keys(transformationObj);
                let keysToGroupBy = transformationObj[keysInTransformation[0]];
                let tempMapKey = "";
                if(coursesOrRooms === "courses"){
                    for(let course of whereResultArray){
                        for(let oneKeyToFind of transformationObj[keysInTransformation[0]]){
                            tempMapKey = tempMapKey + findKEY(course,oneKeyToFind);
                        }
                        groupOBJ[tempMapKey] = groupOBJ[tempMapKey] || [];
                        let curr:any[]=[];
                            curr = groupOBJ[tempMapKey];
                            curr.push(course);
                        tempMapKey = "";
                    }
                }else{
                    for(let room of whereResultArray){
                        for(let oneKeyToFind of transformationObj[keysInTransformation[0]]){
                            tempMapKey = tempMapKey + room[oneKeyToFind];
                        }
                        if(Object.keys(groupOBJ).indexOf(tempMapKey)>=0){
                            let curr:any[]=[];
                            curr = groupOBJ[tempMapKey];
                            curr.push(room);
                            groupOBJ[tempMapKey] = curr;
                        }else{
                            let curr:any[]=[];
                            curr.push(room);
                            groupOBJ[tempMapKey] = curr;
                        }
                        tempMapKey="";
                    }
                }
            }

            function modifyOnColumnsWithNoTransformation(columnsWanted:any[]): any[]{
                let result: any[]=[];
                let obj : {[key:string]: any} = {};
                for(let oneCourse of whereResultArray){
                    obj = {};
                    for(let oneColumn of columnsWanted){
                        let value:any;
                        if(coursesOrRooms === "courses"){
                            value = findKEY(oneCourse,oneColumn);
                        }else {
                            value = oneCourse[oneColumn];
                        }
                        obj[oneColumn] = value;
                    }
                    result.push(obj);
                }
                return result;
            }


            function filtersPass(course: any,whereObject: any):boolean{
                let filter = Object.keys(whereObject)[0];
                let filterRHS = whereObject[filter];
                switch (filter){
                    case "AND":
                        for(let oneFilter of filterRHS){
                            if(!filtersPass(course,oneFilter)){
                                return false;
                            }
                        }
                        return true;
                    case "OR":
                        for(let oneFilter of filterRHS){
                            if(filtersPass(course,oneFilter)){
                                return true;
                            }
                        }
                        return false;
                    case "LT":
                        return filterLT(course,filterRHS);
                    case "GT":
                        return filterGT(course,filterRHS);
                    case "EQ":
                        return filterEQ(course,filterRHS);
                    case "NOT":
                        return !filtersPass(course,filterRHS);
                    case "IS":
                        return filterIS(course,filterRHS);
                }
                return false;
            }

            function filterIS(course:any, RHS: any):boolean{
                let keyToTest = Object.keys(RHS)[0];
                let valueToTest = RHS[keyToTest];
                let correspondingValue:any;
                if(coursesOrRooms === "courses"){
                    correspondingValue = findKEY(course,keyToTest);
                }else {
                    correspondingValue = course[keyToTest];
                }
                if(valueToTest[0] === "*" && valueToTest[valueToTest.length-1] === "*"){
                    let newString = valueToTest.substring(1,valueToTest.length -1);
                    if(correspondingValue.includes(newString)){
                        return true;
                    }
                }else if(valueToTest[0] === "*"){
                    let newString = valueToTest.substring(1);
                    let newLength = newString.length;
                    let correspondingLength = correspondingValue.length;
                    if(correspondingValue.endsWith(newString)){
                        return true;
                    }
                }else if(valueToTest[valueToTest.length-1] === "*"){
                    let newString = valueToTest.substring(0,valueToTest.length-1);
                    let newLength = newString.length;
                    if(correspondingValue.startsWith(newString)){
                        return true;
                    }
                }else if(valueToTest === correspondingValue){
                    return true;
                }

                return false;
            }

            function filterEQ(course:any, RHS: any):boolean{
                let keyOfCourese = Object.keys(RHS)[0];
                let numberToTestWith = RHS[keyOfCourese];
                let correspondingValue:any;
                if(coursesOrRooms === "courses"){
                    correspondingValue = findKEY(course,keyOfCourese);
                }else {
                    correspondingValue = course[keyOfCourese];
                }
                if(correspondingValue === numberToTestWith){
                    return true;
                }else {
                    return false;
                }
            }

            function filterGT(course:any, RHS: any):boolean{
                let keyOfCourese = Object.keys(RHS)[0];
                let numberToTestWith = RHS[keyOfCourese];
                let correspondingValue:any;
                if(coursesOrRooms === "courses"){
                    correspondingValue = findKEY(course,keyOfCourese);
                }else {
                    correspondingValue = course[keyOfCourese];
                }
                if(correspondingValue > numberToTestWith){
                    return true;
                }else {
                    return false;
                }
            }

            function filterLT(course:any, RHS: any):boolean{
                let keyOfCourese = Object.keys(RHS)[0];
                let numberToTestWith = RHS[keyOfCourese];
                let correspondingValue:any;
                if(coursesOrRooms === "courses"){
                    correspondingValue = findKEY(course,keyOfCourese);
                }else if(coursesOrRooms === "rooms"){
                    correspondingValue = course[keyOfCourese];
                }
                if(correspondingValue < numberToTestWith){
                    return true;
                }else {
                    return false;
                }
            }

            function findKEY(course: any, keyToFind: string): any{
                switch(keyToFind){
                    case "courses_dept":
                        return course["Subject"];
                    case "courses_id":
                        return course["Course"];
                    case "courses_instructor":
                        return course["Professor"];
                    case "courses_title":
                        return course["Title"];
                    case "courses_uuid":
                        return course["id"].toString();
                    case "courses_avg":
                        return course['Avg'];
                    case "courses_pass":
                        return course["Pass"];
                    case "courses_fail":
                        return course["Fail"];
                    case "courses_audit":
                        return course["Audit"];
                    case "courses_year":
                        return Number(course["Year"]);
                }
            }

            function isValidQuery(parsedQuery: any): boolean{
                let queryKeys = Object.keys(parsedQuery);
                if(queryKeys.indexOf("WHERE") === -1|| queryKeys.indexOf("OPTIONS") === -1 ||queryKeys.length > 3){
                    // Log.trace("Missing WHERE or OPTIONS!!!");
                    return false;
                }
                let whereObject = parsedQuery['WHERE'];
                let optionObject = parsedQuery['OPTIONS'];
                if(queryKeys.length === 3 && queryKeys.indexOf('TRANSFORMATIONS') === -1){
                    return false;
                }else if(queryKeys.length === 3){
                    haveTransformation = true;
                    let transformationsObject = parsedQuery['TRANSFORMATIONS'];
                    if(!isValidWhere(whereObject)){
                        // Log.trace("The WHERE is invalid");
                        return false;
                    }
                    if(!isValidOptions(optionObject)){
                        // Log.trace("The OPTIONS is invalid");
                        return false;
                    }
                    if(!isValidTransformations(transformationsObject)){
                        return false;
                    }
                }else {
                    if(!isValidWhere(whereObject)){
                        // Log.trace("The WHERE is invalid");
                        return false;
                    }
                    if(!isValidOptions(optionObject)){
                        // Log.trace("The OPTIONS is invalid");
                        return false;
                    }
                }
                return true;
            }

            function isValidTransformations(transObject: any):boolean{
                let keyOfTrans = Object.keys(transObject);
                if(keyOfTrans.length !== 2 || keyOfTrans.indexOf("GROUP") === -1 || keyOfTrans.indexOf("APPLY") === -1){
                    return false;
                }
                if(!isValidGroup(transObject["GROUP"])){
                    return false;
                }
                if(!isValidApply(transObject["APPLY"])){
                    return false;
                }
                return true;
            }

            function isValidApply(applyRHS:any):boolean{
                if(applyRHS instanceof Array){
                    if(applyRHS.length === 0){
                        return true;
                    }
                    let checkDuplicateKeyInApply:any[]=[];
                    for(let curr of applyRHS){
                        if(!isValidApplyKey(curr,checkDuplicateKeyInApply)){
                            return false;
                        }
                    }
                }else {
                    return false;
                }
                return true;
            }

            function isValidApplyKey(applyKey:any,checkDuplicateKeyInApply:any[]){
                if(typeof applyKey !== 'object'){
                    return false;
                }
                let str = Object.keys(applyKey);
                if(str.length !== 1){
                    return false;
                }
                if(!isValidApplyKeyRHS(applyKey[str[0]])){
                    return false;
                }
                if(checkDuplicateKeyInApply.indexOf(str[0]) !== -1){
                    return false;
                }
                checkDuplicateKeyInApply.push(str[0]);
                keyInApply.push(str[0]);
                return true;
            }

            function isValidApplyKeyRHS(obj:any):boolean{
                let key = Object.keys(obj);
                if(key.length !== 1 || !isValidApplyToken(key[0])){
                    return false;
                }
                if(!isValidS_Key(obj[key[0]]) && !isValidM_Key(obj[key[0]])){
                    return false;
                }
                if(['MAX','MIN','AVG','SUM'].indexOf(key[0])>=0 && !isValidM_Key(obj[key[0]])){
                    return false;
                }
                keyTOCheckForCoursesOrRooms.push(obj[key[0]]);
                return true;
            }

            function isValidGroup(groupRHS:any):boolean{
                if(groupRHS instanceof Array){
                    for(let oneKEY of groupRHS){
                        if(!isValidM_Key(oneKEY) && !isValidS_Key(oneKEY)){
                            return false;
                        }
                        keyInGroup.push(oneKEY);
                        keyTOCheckForCoursesOrRooms.push(oneKEY);
                    }
                }else{
                    return false;
                }
                return true;
            }

            function isValidWhere(whereObject: any):boolean{
                if(Object.keys(whereObject).length === 0){
                    return true;
                }
                //let filter = Object.keys(whereObject);
                if(!isValidFilter(whereObject)){
                    // Log.trace("The boject of WHERE is invalid.")
                    return false;
                }
                return true;
            }

            function isValidNEGATION(whereObject:any):boolean{
                let filter = Object.keys(whereObject);
                if(filter[0] !== "NOT"){
                    // Log.trace("In NEGAYION, the filter is not 'NOT', thus failed"+filter[0])
                    return false;
                }
                let objectRHS = whereObject[filter[0]];
                if(!isValidFilter(objectRHS)){
                    // Log.trace("In NEGATION, the RHS object of NOT is not a valid filter.")
                    return false;
                }
                return true;
            }

            function isValidSCOMPARISON(whereObject:any):boolean{
                let filter = Object.keys(whereObject);
                if(filter[0] !== "IS"){
                    // Log.trace("In SCOMPARISON, the filter is not a 'IS', but is: "+filter[0]);
                    return false;
                }
                let objectRHS = whereObject[filter[0]];
                let s_key = Object.keys(objectRHS);
                if(s_key.length !== 1 || !isValidS_Key(s_key[0])){
                    // Log.trace("In SCOMPARISON, the s_key has a length of: "+s_key.length+", and the s_key is: "+s_key[0])
                    return false;
                }
                keyTOCheckForCoursesOrRooms.push(s_key[0]);
                let inputstring = objectRHS[s_key[0]];
                if(typeof inputstring !== "string"){
                    // Log.trace("The inputstring's type is not a string, fail");
                    return false;
                }else if(inputstring.length <1){
                    // Log.trace("The inputstring's length is empty, fail")
                    return false;
                }
                return true;
            }

            function isValidMCOMPARISON(whereObject:any):boolean{
                let filter = Object.keys(whereObject);
                if(["LT","GT","EQ"].indexOf(filter[0])<0){
                    // Log.trace("In MCOMPARISON, the filter is not either of 'LT','GT','EQ', but is "+ filter[0])
                    return false;
                }
                let objectRHS = whereObject[filter[0]];
                let m_key = Object.keys(objectRHS);
                if(m_key.length !== 1 || !isValidM_Key(m_key[0])){
                    // Log.trace("In MCOMPARISON, the m_key has length: "+m_key.length+", and first value of m_key is: "+m_key[0]);
                    return false;
                }
                keyTOCheckForCoursesOrRooms.push(m_key[0]);
                let num = objectRHS[m_key[0]];
                if(typeof num !== "number"){
                    // Log.trace("In MCOMPARISON, the RHS value of m_key is not a number: "+num);
                    return false;
                }
                return true;
            }

            function isValidLOGICCOMPARISON(whereObject:any):boolean{
                let filter = Object.keys(whereObject);
                if(["AND","OR"].indexOf(filter[0])<0){
                    // Log.trace("In LOGICCOMPARISON, the filter is neither 'AND' nor 'OR', but is: "+filter[0])
                    return false;
                }
                if(whereObject[filter[0]].length === 0){
                    return false;
                }
                let arrayOfFilter = whereObject[filter[0]];
                for(let oneFilter of arrayOfFilter){
                    if(!isValidFilter(oneFilter)){
                        return false;
                    }
                }
                return true;
            }

            function isValidFilter(whereObject:any):boolean{
                let filter = Object.keys(whereObject);
                if(filter.length > 1){
                    // Log.trace("In Filter, the length is >1, fail;");
                    return false;
                }

                if(isValidLOGICCOMPARISON(whereObject)){
                    return true;
                }else if(isValidMCOMPARISON(whereObject)){
                    return true;
                }else if(isValidSCOMPARISON(whereObject)){
                    return true;
                }else if(isValidNEGATION(whereObject)){
                    return true;
                }
                return false;
            }

            function isValidOptions(optionObject: any):boolean{
                let optionKeys = Object.keys(optionObject);
                if(optionKeys.length === 0){
                    // Log.trace("The object of OPTION is empty");
                    return false;
                }

                // check columns valid
                if(optionKeys.indexOf("COLUMNS") === -1){
                    // Log.trace("The COLUMNS is invalid");
                    return false;
                }
                let keysInColumns = optionObject['COLUMNS'];
                for(let oneKey of keysInColumns){
                    // Log.trace(oneKey);
                    if(!isValidS_Key(oneKey) && !isValidM_Key(oneKey)){
                        if(haveTransformation){
                            keyToCheckInAPPLY.push(oneKey);
                        }else {
                            return false;
                        }
                    }else{
                        keyTOCheckForCoursesOrRooms.push(oneKey);
                        keyToCheckInGroup.push(oneKey);
                    }
                }

                // check order valid
                if(optionKeys.indexOf("ORDER") !== -1){
                    let ORDER = optionObject["ORDER"];
                    if(typeof ORDER === 'string'){
                        if(ORDER === ''){
                            // Log.trace("The key in OPTIONS is a empty string");
                            return false;
                        }
                        for(let oneKey of keysInColumns){
                            if(oneKey === ORDER){
                                return true;
                            }
                        }
                        // Log.trace("The key in OPTIONS does not match to any of the key in COLUMNS");
                        return false;
                    }else if(typeof ORDER === 'object'){
                        let keyOfOrder = Object.keys(ORDER);
                        if(keyOfOrder.length !== 2 || keyOfOrder.indexOf("dir") === -1 || keyOfOrder.indexOf("keys") === -1){
                            return false;
                        }
                        if(!isValidDIR(ORDER['dir'])){
                            return false;
                        }
                        if(ORDER['keys'] instanceof Array){
                            for(let oneKEY of ORDER['keys']){
                                if(typeof oneKEY !== 'string'|| keysInColumns.indexOf(oneKEY) === -1){
                                    return false;
                                }
                            }
                        }else{
                            return false;
                        }
                    }
                }
                return true;
            }
        });
    }
}