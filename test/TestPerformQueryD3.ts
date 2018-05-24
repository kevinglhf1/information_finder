/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import Log from "../src/Util";
let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

describe("TestPerfromQueryD3", function () {

    var insightFacade:InsightFacade = null;
    before(function () {
        insightFacade = new InsightFacade();
    });

    it("1.", function () {
        Log.trace("Valid Query: for course same dept");
        try{
            var data = fs.readFileSync('./testZIP/testtest5.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "highestAVG"
                        ],
                        "ORDER": "courses_dept"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "highestAVG": {
                                "MAX": "courses_avg"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "highestAVG": 73.13
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
        Log.trace("Valid Query: for course distinct dept");
        try{
            var data = fs.readFileSync('./testZIP/testtest7.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "highestAVG"
                        ],
                        "ORDER": "courses_dept"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "highestAVG": {
                                "MAX": "courses_avg"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "abcd",
                        "highestAVG": 73.13
                    },{
                        "courses_dept": "cpsc",
                        "highestAVG": 71.07
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
        Log.trace("Valid Query: for course with SUM");
        try{
            var data = fs.readFileSync('./testZIP/testtest4.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "totalAVG"
                        ],
                        "ORDER": "courses_dept"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "totalAVG": {
                                "SUM": "courses_avg"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "totalAVG": 144.20
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
        Log.trace("Valid Query: for room with COUNT");
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
                            "rooms_type",
                            "totalCapacity"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["totalCapacity"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_type"],
                        "APPLY": [{
                            "totalCapacity": {
                                "COUNT": "rooms_name"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                            "rooms_type": "Tiered Large Group",
                            "totalCapacity": 3
                        },{
                        "rooms_type": "Small Group",
                        "totalCapacity": 2
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

    it("5.", function () {
        Log.trace("Valid Query: for room with AVG");
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
                            "rooms_type",
                            "avgCapacity"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["avgCapacity"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_type"],
                        "APPLY": [{
                            "avgCapacity": {
                                "AVG": "rooms_seats"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_type": "Tiered Large Group",
                        "avgCapacity": 120
                    },{
                        "rooms_type": "Small Group",
                        "avgCapacity": 40
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

    // TODO with empty apply
    it("6.", function () {
        Log.trace("Valid Query: for courses with empty APPLY");
        try{
            var data = fs.readFileSync('./testZIP/testtest5.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept", "courses_uuid"
                        ],
                        "ORDER": "courses_dept"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept","courses_uuid"],
                        "APPLY": []
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "courses_uuid": "1249"
                    },{
                        "courses_dept": "cpsc",
                        "courses_uuid": "1248"
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

    it("7.", function () {
        Log.trace("Valid Query: for room with MIN");
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
                            "rooms_type",
                            "minCapacity"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["minCapacity"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_type"],
                        "APPLY": [{
                            "minCapacity": {
                                "MIN": "rooms_seats"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_type": "Small Group",
                        "minCapacity": 40
                    },{
                        "rooms_type": "Tiered Large Group",
                        "minCapacity": 80
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

    it("8.", function () {
        Log.trace("Valid Query: for room with two APPLY");
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
                            "rooms_type",
                            "minCapacity",
                            "maxCapacity"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["minCapacity","maxCapacity"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_type"],
                        "APPLY": [{
                            "minCapacity": {
                                "MIN": "rooms_seats"
                            }
                        },{
                            "maxCapacity": {
                                "MAX": "rooms_seats"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_type": "Small Group",
                        "minCapacity": 40,
                        "maxCapacity": 40
                    },{
                        "rooms_type": "Tiered Large Group",
                        "minCapacity": 80,
                        "maxCapacity": 160
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

    it("9.", function () {
        Log.trace("Valid Query: for courses with empty APPLY");
        try{
            var data = fs.readFileSync('./testZIP/testtest5.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "avg"
                        ],
                        "ORDER": "avg"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "avg": {
                                "AVG": "courses_avg"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "avg": 72.1
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

    it("10.", function () {
        Log.trace("Valid Query: for room with two APPLY");
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
                            "rooms_type",
                            "sumCapacity"
                        ],
                        "ORDER": {
                            "dir": "UP",
                            "keys": ["sumCapacity"]
                        }
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_type"],
                        "APPLY": [{
                            "sumCapacity": {
                                "SUM": "rooms_seats"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "rooms_type": "Small Group",
                        "sumCapacity": 80
                    },{
                        "rooms_type": "Tiered Large Group",
                        "sumCapacity": 360
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

    it("11.", function () {
        Log.trace("Valid Query: for courses with empty APPLY");
        try{
            var data = fs.readFileSync('./testZIP/testtest5.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "count"
                        ],
                        "ORDER": "count"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "count": {
                                "COUNT": "courses_avg"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "count": 2
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

    it("12.", function () {
        Log.trace("Valid Query: for courses with empty APPLY");
        try{
            var data = fs.readFileSync('./testZIP/testtest5.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE": {},
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "min"
                        ],
                        "ORDER": "min"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept"],
                        "APPLY": [{
                            "min": {
                                "MIN": "courses_avg"
                            }
                        }]
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "min": 71.07
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
        Log.trace("Invalid: In order, missing KEYS in ORDER");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN"
                }
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 2", function () {
        Log.trace("Invalid: In order, missing DIR in ORDER");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "keys": "blablabla"
                }
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 3", function () {
        Log.trace("Invalid: In order, dir is invalid");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "down",
                    "keys": ["maxSeats"]
                }
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 4", function () {
        Log.trace("Invalid: In order, key is not an array");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": "maxSeats"
                }
            }
        }).then(function (result:InsightResponse) {
            expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 5", function () {
        Log.trace("Invalid: In order, KEY has not been appeared in APPLY");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 6", function () {
        Log.trace("Invalid: In trans: missing group");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 7", function () {
        Log.trace("Invalid: In trans: missing apply");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 8", function () {
        Log.trace("Invalid: COLUMNS term does not match in GROUP or APPLY");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": "rooms_shortname",
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 9", function () {
        Log.trace("Invalid: GROUP term's KEY is invalid");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 10", function () {
        Log.trace("Invalid: APPLYTOKEN is invalid");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": "courses_avg",
                "APPLY": [{
                    "maxSeats": {
                        "max": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 11", function () {
        Log.trace("Invalid: APPLYTOKEN is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeat"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 12", function () {
        Log.trace("Invalid: APPLYTOKEN is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 13", function () {
        Log.trace("Invalid: APPLYTOKEN is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname"
                    }
                },{
                    "maxSeats": {
                        "MAX": "rooms_shortname"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });
    it("Validity 14", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });
    it("Validity 15", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": {}
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 16", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": ["maxSeats"]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 17", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname",
                        "MIN": "rooms_fullname"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });
    it("Validity 18", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_full",
                    }
                },{
                    "maxSeats": {
                        "MIN": "rooms_fullname",
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 18", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_short"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname",
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 19", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": {},
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname",
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 20", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": ""
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_short"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname",
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 21", function () {
        Log.trace("Invalid: FILTER is invalid");
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_fullname",
                    }
                },{
                    "maxSeats": {
                        "MIN": "rooms_fullname",
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 22", function () {
        Log.trace("Invalid: In order, missing KEYS in ORDER");
        return insightFacade.performQuery({
            "WHERE":{
                "IS":{
                    "rooms_name":"DMP_*"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_type",
                    "avgCapacity"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["avgCapacity"]
                }
            },
            "TRANSFORMATION": {
                "GROUP": ["rooms_type"],
                "APPLY": [{
                    "avgCapacity": {
                        "AVG": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });
    it("Validity 23", function () {
        Log.trace("Invalid: In order, missing KEYS in ORDER");
        return insightFacade.performQuery({
            "WHERE":{
                "IS":{

                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_type",
                    "avgCapacity"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["avgCapacity"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": [{
                    "avgCapacity": {
                        "AVG": "rooms_seats"
                    }
                }]
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });


    it("204: delete courses,json", function () {
        // Log.trace("Before removeDataset!!!" );
        return insightFacade.removeDataset('courses').then(function (result: InsightResponse) {
                expect(result).to.deep.equal({code: 204, body: {}});
            }
        ).catch(function (err: InsightResponse) {
            //Log.trace("There is an error when remove Dataset!!!")
            expect.fail();
        })
    });
});

