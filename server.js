const { db, syncAndSeed, models: { Facility, Member, Booking }} = require('./db')
const express = require('express');
const app = express();

const homePage = require('./views/homePage');
const facilities = require('./views/facilities');

app.get('/', (req, res) => {
    res.send(homePage())
});

app.get('/api/facilities', async (req, res) => {
    try {
      const allFacs = await Facility.findAll({
          include: [
              {
                  model: Booking,
                  include: [
                      {
                        model: Member,
                        as: 'bookedBy',
                        include: [
                            {
                                model: Member,
                                as: 'sponsor'
                            }
                        ]
                      }
                  ]
              }
          ]
      });
      res.send(facilities(allFacs))
    //   res.send(allFacs) 
    } catch (error) {
        console.error(error)
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
      const allBooks = await Booking.findAll({
          include: [
              {
                  model: Member,
                  as: 'bookedBy'
              }
          ]
      });
      res.send(allBooks) 
    } catch (error) {
        console.error(error)
    }
});

app.get('/api/members', async (req, res) => {
    try {
      const allMems = await Member.findAll({
          include: [
              {
                model: Member,
                as: 'sponsor'
              },
              {
                  model: Booking,
              },
              {
                  model: Member,
                  as: 'peopleSponsored',
              }
          ]
      });
      res.send(allMems) 
    } catch (error) {
        console.error(error)
    }
});


const init = async () => {
    try {
        await db.authenticate();
        console.log("Connected to database!")

        await syncAndSeed();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`listening on port ${PORT}`));
    } catch (error) {
        console.error(error)
    }
};
init();