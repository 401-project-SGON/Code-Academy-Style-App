  
'use strict';

const supergoose = require('../sopergoose.js');
const auth = require('../middleware/auth.js');
const Users = require('../users.js');

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(async (done) => {
  await supergoose.startDB();
  const adminUser = await new Users(users.admin).save();
  const editorUser = await new Users(users.editor).save();
  const userUser = await new Users(users.user).save();
  done();
});

afterAll(supergoose.stopDB);

describe('Auth Middleware', () => {

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46Zm9v',
        },
      };
      let res = {};
      let next = jest.fn();
      let authE = auth()

      return authE(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith(errorObject);
      });

    }); // it()

    // it('logs in an admin user with the right credentials', () => {

    //   let req = {
    //     headers: {
    //       authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
    //     },
    //   };
    //   let res = {};
    //   let next = jest.fn();
    //   let authE = auth('delete');


    //   return authE(req,res,next)
    //     .then( () => {
    //       console.log('next : ', next);
    //       expect(next).toHaveBeenCalledWith();
    //     });

    // });
     // it()

  });

});