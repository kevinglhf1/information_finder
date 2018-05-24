import {expect} from 'chai';
import Log from "../src/Util";
//import * as fs from 'fs';
let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

describe("TestAddDataset", function () {

    var insightFacade: InsightFacade = null;
    before(function () {
        insightFacade = new InsightFacade();
    });

    // it("blablabla", function () {
    //     try {
    //         var data = fs.readFileSync('../courses.zip', 'base64');
    //         return insightFacade.addDataset('courses', data).then(function (result:InsightResponse) {
    //                 expect(result).to.deep.equal({code: 201, body: {}});
    //             }
    //         ).catch(function (err: InsightResponse) {
    //             expect(err).to.deep.equal({code:400,body:{}});
    //         })
    //     }catch (err){
    //     }
    // });

    it("204: testtest", function () {
        try {
            var data = fs.readFileSync('./testZIP/testtest.zip', 'base64');
            return insightFacade.addDataset('testtest', data).then(function (result: InsightResponse) {
                    expect(result).to.deep.equal({code: 204, body: {}});
                }
            ).catch(function (err: InsightResponse) {
                expect.fail();
            })
        } catch (err) {
            // Log.trace("Read zip file failed!!!" );
            expect.fail();
        }
    });

    it("201: testtest3 ", function () {
        try {
            var data = fs.readFileSync('./testZIP/testtest3.zip', 'base64');
            return insightFacade.addDataset('testtest3', data).then(function (result: InsightResponse) {
                    expect(result).to.deep.equal({code: 204, body: {}});
                }
            ).catch(function (err: InsightResponse) {
                expect.fail()
            })
        } catch (err) {
            expect.fail();
        }
    });

    it("203: testtest Duplicate", function () {
        try {
            var data = fs.readFileSync('./testZIP/testtest.zip', 'base64');
            return insightFacade.addDataset('testtest', data).then(function (result: InsightResponse) {
                    expect(result).to.deep.equal({code: 201, body: {}});
                }
            ).catch(function (err: InsightResponse) {
                expect.fail();
            })
        } catch (err) {
            // Log.trace("Read zip file failed!!!" );
            expect.fail();
        }
    });


    it("400: testtest2", function () {
        try {
            var data = fs.readFileSync('./testZIP/testtest2.zip', 'base64');
            // Log.trace("Before addDataset!!!" );
            return insightFacade.addDataset('testtest2', data).then(function (result: InsightResponse) {
                    expect.fail();
                }
            ).catch(function (err: InsightResponse) {
                expect(err.code).to.deep.equal(400);
            })
        } catch (err) {
            //Log.trace("Read zip file failed!!!" );
            expect.fail();
        }
    });

    it("204: delete testtest", function () {
        // Log.trace("Before removeDataset!!!" );
        return insightFacade.removeDataset('testtest').then(function (result: InsightResponse) {
                expect(result).to.deep.equal({code: 204, body: {}});
            }
        ).catch(function (err: InsightResponse) {
            //Log.trace("There is an error when remove Dataset!!!")
            expect.fail();
        })
    });

    it("404: delete blablabla", function () {
        // .trace("Before removeDataset!!!" );
        return insightFacade.removeDataset('blablabla').then(function (result: InsightResponse) {
                expect.fail();
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 404, body: {'error':'Try to delete non-exist file'}});
        })
    });
});

// fs.readFile('../courses.zip', 'utf8', ((err, data) => {
//     //console.log("output is:", output);
//     if (err) throw err;
//     log.trace("1111111");
//     insightFacade.addDataset('courses', data);
// }));