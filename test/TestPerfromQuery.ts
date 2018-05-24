/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import Log from "../src/Util";
let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

describe("TestPerfromQuery", function () {

    var insightFacade:InsightFacade = null;
    before(function () {
        insightFacade = new InsightFacade();
    });

    it("1.", function () {
        Log.trace("Valid Query + Pass 'GT': ");
        try{
            var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_avg":70
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "courses_avg": 71.07
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
        Log.trace("Valid Query + Not Pass 'GT': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "GT":{
                        "courses_avg":80
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result.body).to.deep.equal({result:[]});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("3.", function () {
        Log.trace("Valid Query + Pass 'LT': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "LT":{
                        "courses_avg":80
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("4.", function () {
        Log.trace("Valid Query + Not Pass 'LT': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "LT":{
                        "courses_avg":70
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("5.", function () {
        Log.trace("Valid Query + Pass 'EQ': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "EQ":{
                        "courses_avg":71.07
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("6.", function () {
        Log.trace("Valid Query + Not Pass 'EQ': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "EQ":{
                        "courses_avg":70
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("7.", function () {
        Log.trace("Valid Query +  Pass 'NOT'&'EQ': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "NOT": {
                        "EQ": {
                            "courses_avg": 70
                        }
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_fail",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_fail": 38,
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("8.", function () {
        Log.trace("Valid Query + Not Pass 'NOT'&'EQ': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "NOT": {
                        "EQ": {
                            "courses_avg": 71.07
                        }
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("9.", function () {
        Log.trace("Valid Query + Pass 'AND'&'GT': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "AND": [{
                        "GT": {
                            "courses_avg": 60
                        }
                    }, {
                        "GT": {
                            "courses_pass": 100
                        }
                    }]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_pass",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_pass": 180,
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("10.", function () {
        Log.trace("Valid Query + Not Pass 'AND'&'GT'+'LT' becuase one case in AND fail: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "AND": [{
                        "GT": {
                            "courses_avg": 60
                        }
                    }, {
                        "LT": {
                            "courses_pass": 100
                        }
                    }]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_pass",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("11.", function () {
        Log.trace("Valid Query + Not Pass 'AND'&'LT'+'LT' becuase both case in AND fail: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "AND": [{
                        "LT": {
                            "courses_avg": 60
                        }
                    }, {
                        "LT": {
                            "courses_pass": 100
                        }
                    }]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("12.", function () {
        Log.trace("Valid Query + Pass 'OR'&'GT'+'LT' becuase one case in OR pass: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "OR": [{
                        "GT": {
                            "courses_avg": 60
                        }
                    }, {
                        "LT": {
                            "courses_pass": 100
                        }
                    }]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("13.", function () {
        Log.trace("Valid Query + Not Pass 'OR'&'LT'+'LT' becuase both case in OR fail: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "OR": [{
                        "LT": {
                            "courses_avg": 60
                        }
                    }, {
                        "LT": {
                            "courses_pass": 100
                        }
                    }]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("14.", function () {
        Log.trace("Valid Query + Pass 'IS' with no *: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS": {
                        "courses_dept": "cpsc"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("15.", function () {
        Log.trace("Valid Query + Pass 'IS' with * only at beginning: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS": {
                        "courses_dept": "*c"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("16.", function () {
        Log.trace("Valid Query + Pass 'IS' with * only at the end: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS": {
                        "courses_dept": "c*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("17.", function () {
        Log.trace("Valid Query + Pass 'IS' with *s at beginning and the end: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS": {
                        "courses_dept": "*c*"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("18.", function () {
        Log.trace("Valid Query + Not Pass 'IS' because not equal string: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "IS": {
                        "courses_dept": "econ"
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("20.", function () {
        Log.trace("Valid Query + Two courses object(without change order): ");
        var data = fs.readFileSync('./testZIP/testtest4.zip', 'base64');
        Log.trace("here/");
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "GT": {
                        "courses_avg": 70
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                },{
                    "courses_dept": "cpsc",
                    "courses_avg": 73.13
                }]}});
            }).catch(function (err:InsightResponse) {
                Log.trace("1");
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            Log.trace("1");
            expect.fail();
        })
    });

    it("20.", function () {
        Log.trace("Valid Query + Two courses object(with a change of order): ");
        var data = fs.readFileSync('./testZIP/testtest5.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "GT": {
                        "courses_avg": 70
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_dept": "cpsc",
                    "courses_avg": 71.07
                },{
                    "courses_dept": "cpsc",
                    "courses_avg": 73.13
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("21.", function () {
        Log.trace("Valid Query + Checking attributes in 's_key' and 'm_key': ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "AND":[{
                        "IS": {
                            "courses_id": "110"
                        }
                    },{
                        "IS": {
                            "courses_instructor": "*gregor"
                        }
                    },{
                        "EQ":{
                            "courses_audit":0
                        }
                    }]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_title",
                        "courses_uuid"
                    ]
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_title": "comptn, progrmng",
                    "courses_uuid": "1248"
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("22.", function () {
        Log.trace("Valid Query + empty WHERE: ");
        var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{},
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_title",
                        "courses_uuid"
                    ]
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_title": "comptn, progrmng",
                    "courses_uuid": "1248"
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("23.", function () {
        Log.trace("Valid Query + Change Year: ");
        var data = fs.readFileSync('./testZIP/testtest6_Year.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{
                    "EQ": {
                        "courses_year": 1900
                    }
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_id"
                    ]
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_id": "110"
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("24.", function () {
        Log.trace("Valid Query + Filter by year: ");
        var data = fs.readFileSync('./testZIP/testtest6_Year.zip', 'base64');
        return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
            return insightFacade.performQuery({
                "WHERE":{},
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_year"
                    ]
                }
            }).then(function (result:InsightResponse) {
                expect(result.code).to.deep.equal(200);
                expect(result).to.deep.equal({code: 200, body: {result:[{
                    "courses_year": 1900
                },{
                    "courses_year": 2014
                }]}});
            }).catch(function (err:InsightResponse) {
                expect.fail();
            })
        }).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });


    it("Validity 1", function () {
        Log.trace("Invalid Query(testing WHERE): missing WHERE");
        return insightFacade.performQuery({
            "OPTIONS":{
                "COLUMNS":[
                    "courses_avg",
                    "courses_avg"
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

    it("Validity 2", function () {
        Log.trace("Invalid Qery(testing OPTIONS): missing OPTIONS");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
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
        Log.trace("Invalid Qery(testing OPTIONS): key in ORDER is not exist in keys of COLUMNS");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"courses_id"
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 4", function () {
        Log.trace("Invalid Query(testing OPTIONS): key in COLUMNS does not match the template");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "blablabla",
                    "courses_avg"
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

    it("Validity 5", function () {
        Log.trace("Invalid Query: with 'And' has less than one object")
        return insightFacade.performQuery({
            "WHERE":{
                "AND":[]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 6", function () {
        Log.trace("InValid Query(testing WHERE): MCOMPARISON 'GT'");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97,
                    "courses_pass": 100
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 7", function () {
        Log.trace("InValid Query(testing WHERE): 'IS' RHS has an empty string");
        return insightFacade.performQuery({
            "WHERE":{
                "IS":{
                    "courses_dept":""
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 8", function () {
        Log.trace("InValid Query(testing WHERE): 'IS' RHS is a number");
        return insightFacade.performQuery({
            "WHERE":{
                "IS":{
                    "courses_dept":0
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 10", function () {
        Log.trace("InValid Query(testing WHERE): 'NOT' LHS is not m_key or s_key");
        return insightFacade.performQuery({
            "WHERE":{
                "NOT":{
                    "blablabla":"aaa"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 11", function () {
        Log.trace("InValid Query(testing WHERE): 'IS' LHS is not m_key or s_key");
        return insightFacade.performQuery({
            "WHERE":{
                "IS":{
                    "blablabla":"aaa"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 12", function () {
        Log.trace("InValid Query(testing WHERE): 'GT' RHS is not a number");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":"aaa"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 13", function () {
        Log.trace("Invalid Query: with empty RHS in filter")
        return insightFacade.performQuery({
            "WHERE":{
                "AND":[{
                    "GT":{

                    }
                },{
                    "GT":{
                        "courses_avg":"aaa"
                    }
                }]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 14", function () {
        Log.trace("Invalid Query: with more than one filter")
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":66
                },
                "IS":{
                    "courses_dept":"aaa"
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
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

    it("Validity 15", function () {
        Log.trace("Invalid Qery(testing OPTIONS): OPTIONS is empty");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{}
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 16", function () {
        Log.trace("Invalid Qery(testing OPTIONS): in OPTIONS has no COLUMN");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "ORDER":"courses_avg"
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("Validity 17", function () {
        Log.trace("Invalid Qery(testing OPTIONS): key in ORDER is not exist in keys of COLUMNS");
        return insightFacade.performQuery({
            "WHERE":{
                "GT":{
                    "courses_avg":97
                }
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER":"uug"
            }
        }).then(function (result:InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 400, body: {}});
        })
    });

    it("424", function () {
        Log.trace("Valid Query + Pass 'GT': ");
        try{
            var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
            return  insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
                return insightFacade.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_avg":70
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }).then(function (result:InsightResponse) {
                    expect(result.code).to.deep.equal(200);
                    expect(result.body).to.deep.equal({result:[{
                        "courses_dept": "cpsc",
                        "courses_avg": 71.07
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


    it("204: delete testtest", function () {
        // Log.trace("Before removeDataset!!!" );
        return insightFacade.removeDataset('testtest3').then(function (result: InsightResponse) {
                expect(result).to.deep.equal({code: 204, body: {}});
            }
        ).catch(function (err: InsightResponse) {
            //Log.trace("There is an error when remove Dataset!!!")
            expect.fail();
        })
    });

});

