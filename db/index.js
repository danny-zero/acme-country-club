const Sequelize = require('sequelize');
const facilities = require('../views/facilities');
const { DATE, STRING, UUID, UUIDV4 } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-country-club', {logging: false});

const Facility = db.define('facility', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    fac_name: {
        type: STRING(100),
        allowNull: false,
        unique: true
    }
});

const Member = db.define('member', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    first_name: {
        type: STRING(100),
        allowNull: false,
        unique: true
    }
});

const Booking = db.define('booking', {
    startTime: {
        type: DATE,
        allowNull: false
    },
     endTime: {
        type: DATE,
        allowNull: false
    }
});

Booking.belongsTo(Member, {as: 'bookedBy'});
Member.belongsTo(Member, {as: 'sponsor'});
Member.hasMany(Booking, {foreignKey: 'bookedById'});
Member.hasMany(Member, {foreignKey: 'sponsorId', as: 'peopleSponsored'})
Facility.hasMany(Booking, {foreignKey: 'facilityId'});
// Booking.belongsTo(Facility)

const syncAndSeed = async () => {
    await db.sync({force: true});

    const [moe, lucy, larry] = await Promise.all([
        Member.create({first_name: 'moe'}),
        Member.create({first_name: 'lucy'}),
        Member.create({first_name: 'larry'})
    ]);

    const [pool, tennisCourt, golfCourse] = await Promise.all([
        Facility.create({fac_name: 'pool'}),
        Facility.create({fac_name: 'tennis court'}),
        Facility.create({fac_name: 'golf course'}),
    ]);

    moe.sponsorId = larry.id;
    lucy.sponsorId = larry.id;
    await Promise.all([moe.save(), lucy.save()]);

    const [one, two, three] = await Promise.all([
        Booking.create({startTime: '2021-06-12 02:59:00', endTime: '2021-06-12 03:59:00'}),
        Booking.create({startTime: '2021-06-13 02:59:00', endTime: '2021-06-13 03:59:00'}),
        Booking.create({startTime: '2021-06-14 02:59:00', endTime: '2021-06-12 03:59:00'}),
    ]);

    one.bookedById = moe.id;
    one.facilityId = pool.id;
    one.save();

};


module.exports = {
    db,
    syncAndSeed,
    models: {
        Facility,
        Member,
        Booking
    }
};


