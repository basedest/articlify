import { registerOTel } from '@vercel/otel';
import { MongoClient, ObjectId } from 'mongodb';

export async function register() {
    registerOTel({ serviceName: 'articlify' });
    await migrateBetterAuth();
}

async function migrateBetterAuth() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();

    const usersCol = db.collection('users');
    const userCol = db.collection('user');
    const accountCol = db.collection('account');

    const existing = await userCol.countDocuments();
    if (existing > 0) {
        console.warn('Better Auth "user" collection already has documents. Skipping to avoid duplicates.');
        await client.close();
        return;
    }
    console.log('Migrating Better Auth...');

    const mongooseUsers = await usersCol.find({}).toArray();
    console.log(`Found ${mongooseUsers.length} users in "users" collection.`);

    for (const u of mongooseUsers) {
        const id = u._id.toString();
        const now = u.regDate ? new Date(u.regDate) : new Date();

        const userDoc = {
            _id: new ObjectId(id),
            name: u.name ?? '',
            email: (u.email ?? '').toLowerCase(),
            emailVerified: false,
            image: u.image ?? null,
            createdAt: now,
            updatedAt: now,
            role: u.role ?? 'user',
            regDate: u.regDate ? new Date(u.regDate) : now,
            preferredLanguage: u.preferredLanguage ?? null,
            username: (u.name ?? '').toLowerCase(),
            displayUsername: u.name ?? '',
        };

        await userCol.insertOne(userDoc);

        const accountDoc = {
            _id: new ObjectId(),
            userId: id,
            providerId: 'credential',
            accountId: id,
            password: u.password ?? null,
            createdAt: now,
            updatedAt: now,
        };

        await accountCol.insertOne(accountDoc);
        console.log(`Migrated user: ${u.name} (${id})`);
    }

    console.log('Migration done.');
    await client.close();
}
