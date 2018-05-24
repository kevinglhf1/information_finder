/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
let fs = require('fs');

describe("TestRest", function () {
    let URL = "http://127.0.0.1:4321";
    let server:Server;
    this.timeout(5000);

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
       // Log.test('Before: ' + (<any>this).test.parent.title);
        chai.use(chaiHttp);
        server = new Server(4321);
        return server.start();
    });
    after(function () {
         Log.test('After: ' + (<any>this).test.parent.title);
         return server.stop();
     });


    it("PUT_1", function () {
        return chai.request(URL)
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./testZIP/courses.zip"), "courses.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.be.equal(201);
            })
            .catch(function (err) {
              //  Log.trace('catch:');
                // some assertions
                Log.trace('err is: '+ err);
                expect.fail();
            });
    });

    it("PUT_error", function () {
        return chai.request(URL)
            .put('/dataset/error')
           // .attach("body", fs.readFileSync("./testZIP/courses.zip"), "courses.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect.fail();
            })
            .catch(function (err) {
                //  Log.trace('catch:');
                // some assertions
                Log.trace('err is: '+ err);
                expect(err.status).to.be.equal(500);
            });
    });

    it("PUT_2", function () {
        return chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./testZIP/rooms.zip"), "rooms.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.be.equal(204);
            })
            .catch(function (err) {
                Log.trace('catch:');
                Log.trace('err is: '+ err);
                // some assertions
                expect.fail();
            });
    });

    it("POST_1", function () {
        return chai.request(URL)
            .post('/query')
            .send({
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
            })
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.be.equal(200);
            })
            .catch(function (err) {
                //  Log.trace('catch:');
                // some assertions
                Log.trace('err is: '+ err);
                expect.fail();
            });
    });

    it("POST_2", function () {
        return chai.request(URL)
            .post('/query')
            .send({
            })
            .then(function (res: Response) {
                Log.trace('then:');
                expect.fail();

            })
            .catch(function (err) {
                //  Log.trace('catch:');
                // some assertions
                Log.trace('err is: '+ err);
                expect(err.status).to.be.equal(400);
            });
    });

    it("POST_error", function () {
        return chai.request(URL)
            .post('/querwdwdy')
            .catch(function (err) {
                //  Log.trace('catch:');
                // some assertions
                Log.trace('err is: '+ err);
                expect(err.status).to.be.equal(404);
            });
    });


    it("PUT_invalid", function () {
        return chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./testZIP/invalidRooms.zip"), "invalidRooms.zip")
            .then(function (res: Response) {
                Log.trace('then:');
                expect.fail();
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions
                expect(err.status).to.be.equal(400);
            });
    });


    it("DEL_1", function () {
        return chai.request(URL)
            .del('/dataset/rooms')
            .attach("body", fs.readFileSync("./testZIPfolder/rooms.json"), "rooms.json")
            .then(function (res: Response) {
                Log.trace('then:');
                expect(res.status).to.be.equal(204);
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions
                expect.fail();
            });
    });


    it("DEL_2", function () {
        return chai.request(URL)
            .del('/dataset/rooms')
            .attach("body", fs.readFileSync("./testZIPfolder/invalidRooms.json"), "invalidRooms.json")
            .then(function (res: Response) {
                Log.trace('then:');
                expect.fail();
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions
                expect(err.status).to.be.equal(404);
            });
    });

    it("DEL_error", function () {
        return chai.request(URL)
            .del('/dataset/error')
           // .attach("body", fs.readFileSync("./testZIPfolder/invalidRooms.json"), "invalidRooms.json")
            .then(function (res: Response) {
                Log.trace('then:');
                expect.fail();
            })
            .catch(function (err) {
                Log.trace('catch:');
                // some assertions
                expect(err.status).to.be.equal(404);
            });
    });
});
