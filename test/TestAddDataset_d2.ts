import {expect} from 'chai';
import Log from "../src/Util";
//import * as fs from 'fs';
let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

describe("TestAddDataset_d2", function () {

    var insightFacade:InsightFacade = null;
    before(function () {
        insightFacade = new InsightFacade();
    });

    it("d2_204: testForAdd", function () {
        try {
            var data = fs.readFileSync('./testZIP/rooms.zip', 'base64');
            return insightFacade.addDataset('rooms', data).then(function (result:InsightResponse) {
                    expect(result).to.deep.equal({code: 204, body: {}});
                }
            ).catch(function (err: InsightResponse) {
                expect.fail();
            })
        }catch (err){
            expect.fail();
        }
    });

    it("d2_201: AddDuplicateID", function () {
        try {
            var data = fs.readFileSync('./testZIP/rooms.zip', 'base64');
            return insightFacade.addDataset('rooms', data).then(function (result:InsightResponse) {
                    expect(result).to.deep.equal({code: 201, body: {}});
                }
            ).catch(function (err: InsightResponse) {
                expect.fail();
            })
        }catch (err){
            expect.fail();
        }
    });

    it("d2_400: AddWrongID", function () {
        try {
            var data = fs.readFileSync('./testZIP/rooms.zip', 'base64');
            return insightFacade.addDataset('cs', data).then(function (result:InsightResponse) {
                    expect(result).to.deep.equal({code: 204, body: {}});
                }
            ).catch(function (err: InsightResponse) {
                expect(err).to.deep.equal({code: 400, body: {'error': "id is wrong"}});
            })
        }catch (err){
            expect.fail();
        }
    });


    it("d2_204: RemoveSuccessfully", function () {
        return insightFacade.removeDataset('rooms').then(function (result:InsightResponse) {
                expect(result).to.deep.equal({code: 204, body: {}});
            }
        ).catch(function (err: InsightResponse) {
            expect.fail();
        })
    });

    it("d2_404: Fail to remove", function () {
        return insightFacade.removeDataset('rooms').then(function (result:InsightResponse) {
               expect.fail()
            }
        ).catch(function (err: InsightResponse) {
            expect(err).to.deep.equal({code: 404, body: {'error': 'Try to delete non-exist file'}});
        })
    });


});

