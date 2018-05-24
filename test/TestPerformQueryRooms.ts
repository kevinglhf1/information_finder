/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import Log from "../src/Util";
let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

describe("TestPerfromQueryRooms", function () {

    var insightFacade:InsightFacade = null;
    before(function () {
        insightFacade = new InsightFacade();
    });


    it("1.", function () {
        Log.trace("Valid Query + Pass 'IS': ");
        try{
            var data = fs.readFileSync('./testZIP/rooms_DMP.zip', 'base64');
            return  insightFacade.addDataset('rooms', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                "WHERE":{
                    "IS":{
                        "rooms_name":"DMP_*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_name"
                    ],
                    "ORDER":"rooms_name"
                }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_name": "DMP_101"
                    },{
                        "rooms_name": "DMP_110"
                    },{
                        "rooms_name": "DMP_201"
                    },{
                        "rooms_name": "DMP_301"
                    },{
                        "rooms_name": "DMP_310"
                    }]});
                }).catch(function (err1:InsightResponse) {
                    //Log.trace("PerformQuery failed");
                    expect.fail();
                })
            }).catch(function (err2: InsightResponse) {
                //Log.trace("AddDataset failed");
                expect.fail();
            })
        }catch (err){
            //Log.trace("ReadFileSync failed");
            expect.fail();
        }
    });

    it("2.", function () {
        Log.trace("Valid Query + Pass 'GT': ");
        try{
            var data = fs.readFileSync('./testZIP/rooms_DMP.zip', 'base64');
            return  insightFacade.addDataset('rooms', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "rooms_seats":20
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name"
                        ],
                        "ORDER":"rooms_name"
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_name": "DMP_101"
                    },{
                        "rooms_name": "DMP_110"
                    },{
                        "rooms_name": "DMP_201"
                    },{
                        "rooms_name": "DMP_301"
                    },{
                        "rooms_name": "DMP_310"
                    }]});
                }).catch(function (err1:InsightResponse) {
                    //Log.trace("PerformQuery failed");
                    expect.fail();
                })
            }).catch(function (err2: InsightResponse) {
                //Log.trace("AddDataset failed");
                expect.fail();
            })
        }catch (err){
            //Log.trace("ReadFileSync failed");
            expect.fail();
        }
    });

    it("3.", function () {
        Log.trace("Valid Query + Pass 'LT': ");
        try{
            var data = fs.readFileSync('./testZIP/rooms_DMP.zip', 'base64');
            return  insightFacade.addDataset('rooms', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE":{
                        "LT":{
                            "rooms_seats":100
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_name",
                            "rooms_seats"
                        ],
                        "ORDER":"rooms_name"
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_name": "DMP_101",
                        "rooms_seats": 40
                    },{
                        "rooms_name": "DMP_201",
                        "rooms_seats": 40
                    },{
                        "rooms_name": "DMP_301",
                        "rooms_seats": 80
                    }]});
                }).catch(function (err1:InsightResponse) {
                    //Log.trace("PerformQuery failed");
                    expect.fail();
                })
            }).catch(function (err2: InsightResponse) {
                //Log.trace("AddDataset failed");
                expect.fail();
            })
        }catch (err){
            //Log.trace("ReadFileSync failed");
            expect.fail();
        }
    });


    it("4.", function () {
        Log.trace("Valid Query + Pass 'EQ': ");
        try{
            var data = fs.readFileSync('./testZIP/rooms_DMP.zip', 'base64');
            return  insightFacade.addDataset('rooms', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE":{
                        "EQ":{
                            "rooms_seats":40
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_type"
                        ],
                        "ORDER":"rooms_type"
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_type": "Small Group"
                    },{
                        "rooms_type": "Small Group"
                    }]});
                }).catch(function (err1:InsightResponse) {
                    //Log.trace("PerformQuery failed");
                    expect.fail();
                })
            }).catch(function (err2: InsightResponse) {
                //Log.trace("AddDataset failed");
                expect.fail();
            })
        }catch (err){
            //Log.trace("ReadFileSync failed");
            expect.fail();
        }
    });

    it("Validity 1", function () {
        Log.trace("Invalid Query: have both courses and rooms");
        return insightFacade.performQuery({
            "WHERE":{},
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg",
                    "rooms_furniture"
                ],
                "ORDER":"courses_avg"
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("204: delete rooms.json", function () {
        // Log.trace("Before removeDataset!!!" );
        return insightFacade.removeDataset('rooms').then(function (result: InsightResponse) {
                expect(result).to.deep.equal({code: 204, body: {}});
            }
        ).catch(function (err: InsightResponse) {
            //Log.trace("There is an error when remove Dataset!!!")
            expect.fail();
        })
    });
});
