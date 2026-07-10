import * as assert from 'node:assert';
import { describe, it } from 'node:test';

import { Persistence } from '../Persistence';
import { createRecordingSender } from './helpers/parityHarness';

const setup = () => {
	const rec = createRecordingSender();
	return { rec, senderFn: rec.sender };
};

describe('Persistence (base-runtime)', () => {
	it('create forwards data with the APP_ID sentinel', async () => {
		const { rec, senderFn } = setup();
		await new Persistence(senderFn).create({ a: 1 });
		assert.deepStrictEqual(rec.emitted()[0], { method: 'bridges:getPersistenceBridge:doCreate', params: [{ a: 1 }, 'APP_ID'] });
	});

	it('createWithAssociation wraps the single association into an array (doCreateWithAssociations)', async () => {
		const { rec, senderFn } = setup();
		const assoc = { type: 1, id: 'x' } as any;
		await new Persistence(senderFn).createWithAssociation({ a: 1 }, assoc);
		assert.deepStrictEqual(rec.emitted()[0], {
			method: 'bridges:getPersistenceBridge:doCreateWithAssociations',
			params: [{ a: 1 }, [assoc], 'APP_ID'],
		});
	});

	it('update defaults upsert to false', async () => {
		const { rec, senderFn } = setup();
		await new Persistence(senderFn).update('id1', { a: 1 });
		assert.deepStrictEqual(rec.emitted()[0], {
			method: 'bridges:getPersistenceBridge:doUpdate',
			params: ['id1', { a: 1 }, false, 'APP_ID'],
		});
	});

	it('updateByAssociation wraps the association and defaults upsert to false', async () => {
		const { rec, senderFn } = setup();
		const assoc = { type: 1, id: 'x' } as any;
		await new Persistence(senderFn).updateByAssociation(assoc, { a: 1 });
		assert.deepStrictEqual(rec.emitted()[0], {
			method: 'bridges:getPersistenceBridge:doUpdateByAssociations',
			params: [[assoc], { a: 1 }, false, 'APP_ID'],
		});
	});

	it('removeByAssociation wraps the single association into an array', async () => {
		const { rec, senderFn } = setup();
		const assoc = { type: 1, id: 'x' } as any;
		await new Persistence(senderFn).removeByAssociation(assoc);
		assert.deepStrictEqual(rec.emitted()[0], {
			method: 'bridges:getPersistenceBridge:doRemoveByAssociations',
			params: [[assoc], 'APP_ID'],
		});
	});
});
