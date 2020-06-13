const request = require("supertest");
const app = require("../../app");

// na thimame na stelno valid passwords

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});
// prepei na kano expect to idio status code me afto pou exo sto kanoniko mou app

it("returns a 422 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "alskdflaskjfd",
      password: "password",
    })
    .expect(422);
});

it("returns a 422 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "alskdflaskjfd",
      password: "p",
    })
    .expect(422);
});

it("returns a 422 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(422);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "alskjdf",
    })
    .expect(422);
});

it("disallows duplicate emails", async () => {
  // epidi den kano save kati monima sto database gia na tskearo duplicate user stelno dio request sto proto gia na dimiourgiso to user kai sto deftero gia na paro error an o user idi iparxei
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(422);
});

it("Checking that the response returns a token", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email: "test@test.com",
    password: "password",
  });
  console.log("response: ", response.body.token);
  expect(response.body.token);
});

it("checking login route that returns the RIGHT Token so i can go on protected request", async () => {
  const FirstResponse = await request(app)
    //to proto route einai sot signup gia na fitakso user kai to defteor einai sto login
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    });
  expect(201);

  const response = await request(app)
    .get("/test_protected_route")
    .set("Authorization", "Bearer " + FirstResponse.body.token)
    .send();

  // console.log("protected route: ", response.body.message);
  //to protected route girnay message to thema einai oti kai otan exo erro kano return message opote gia na ta ksexariso leo oti thelo to response mou na ginaei message pou na eina idio me to message pou kano return otan pao sto protected route  (to protected route to exo sto app.js)
  expect(response.body.message).toEqual("protected route");
});

//########### Tests gia logged in tha borousan a exia to functionality ton routes se ksexrositso file ka ##########

it("fails when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(401);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/login")
    .send({
      email: "test@test.com",
      password: "aslkdfjalskdfj",
    })
    .expect(401);
});

it("checking login route that returns a token", async () => {
  await request(app)
    //to proto route einai sot signup gia na fitakso user kai to defteor einai sto login
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app).post("/api/users/login").send({
    email: "test@test.com",
    password: "password",
  });

  expect(response.body.token);
});

//############### Protected route oste na do an to token pou kano attach sto request einai sosto

it("checking login route that returns the RIGHT Token so i can go on protected request", async () => {
  await request(app)
    //to proto route einai sot signup gia na fitakso user kai to defteor einai sto login
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const FirstResponse = await request(app)
    //to proto route einai sot signup gia na fitakso user kai to defteor einai sto login
    .post("/api/users/login")
    .send({
      email: "test@test.com",
      password: "password",
    });
  expect(201);

  const response = await request(app)
    .get("/test_protected_route")
    .set("Authorization", "Bearer " + FirstResponse.body.token)
    .send();

  // console.log("protected route: ", response.body.message);
  //to protected route girnay message to thema einai oti kai otan exo erro kano return message opote gia na ta ksexariso leo oti thelo to response mou na ginaei message pou na eina idio me to message pou kano return otan pao sto protected route  (to protected route to exo sto app.js)
  expect(response.body.message).toEqual("protected route");
});

//############ teskaro oti dne boro na pao sto protected route an den eimai anteticated ####################

it("checking that i can not go to protected route without token", async () => {
  await request(app)
    //to proto route einai sot signup gia na fitakso user kai to defteor einai sto login
    .get("/test_protected_route")
    .send()
    .expect(401);
});
