/* global describe, it */
/* eslint-disable no-underscore-dangle */

const { expect } = require('chai');
const rewire = require('rewire');

const telegram = rewire('./telegram');
const { setWebhook, deleteWebhook } = telegram;

describe('telegram', () => {
    it('sets webhook (success)', async () => {
        async function request({ method = 'get', action, data = {} }) {
            expect(method).to.be.equal('get');
            expect(action).to.be.equal('setWebhook');
            expect(data).to.be.deep.equal({
                url: 'http://some.testing/webhook/url/',
            });
            return Promise.resolve({
                ok: true,
                result: true,
            });
        }
        const revert = telegram.__set__('request', request);
        await setWebhook('http://some.testing/webhook/url/');
        revert();
    });

    it('sets webhook (fail)', async () => {
        async function request({ method = 'get', action, data = {} }) {
            expect(method).to.be.equal('get');
            expect(action).to.be.equal('setWebhook');
            expect(data).to.be.deep.equal({
                url: 'http://some.testing/webhook/url/',
            });
            return Promise.resolve({
                ok: true,
                result: false,
            });
        }
        const revert = telegram.__set__('request', request);
        try {
            await setWebhook('http://some.testing/webhook/url/');
        } catch (e) {
            expect(e.message).to.equal('unable to set telegram webhook');
        }
        revert();
    });

    it('deletes webhook (success)', async () => {
        async function request({ method = 'get', action, data = {} }) {
            expect(method).to.be.equal('post');
            expect(action).to.be.equal('deleteWebhook');
            expect(data).to.be.deep.equal({});
            return Promise.resolve({
                ok: true,
                result: true,
            });
        }
        const revert = telegram.__set__('request', request);
        await deleteWebhook();
        revert();
    });

    it('deletes webhook (fail)', async () => {
        async function request({ method = 'get', action, data = {} }) {
            expect(method).to.be.equal('post');
            expect(action).to.be.equal('deleteWebhook');
            expect(data).to.be.deep.equal({});
            return Promise.resolve({
                ok: true,
                result: false,
            });
        }
        const revert = telegram.__set__('request', request);
        try {
            await deleteWebhook();
        } catch (e) {
            expect(e.message).to.equal('unable to delete telegram webhook');
        }
        revert();
    });
});
