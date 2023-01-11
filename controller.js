import { v4 as uuidv4 } from "uuid";
import fs from "fs";
export class Controller {
  async getUsers() {
    return new Promise((resolve, _) => {
      fs.readFile("./users.json", (err, data) => {
        if (err) throw err;
        const myDatabase = JSON.parse(data);
        resolve(myDatabase);
      });
    });
  }
  async getUser(id) {
    return new Promise((resolve, reject) => {
      fs.readFile("./users.json", (err, data) => {
        if (err) throw err;
        const myDatabase = JSON.parse(data);
        let user = myDatabase.find((elem) => elem.id === id);
        if (user) {
          resolve(user);
        } else {
          reject(`User with id ${id} not found `);
        }
      });
    });
  }

  async createUser(user) {
    return new Promise((resolve, _) => {
      let newUser = {
        id: uuidv4(),
        ...user,
      };
      fs.readFile("./users.json", (err, data) => {
        if (err) throw err;
        const myDatabase = JSON.parse(data);
        myDatabase.push(newUser);
        fs.writeFile("./users.json", JSON.stringify(myDatabase), (err) => {
          if (err) throw err;
          console.log("New data added");
        });
      });

      resolve(newUser);
    });
  }

  async updateUser(userData, id) {
    return new Promise((resolve, reject) => {
      const { username, age, hobbies } = userData;
      fs.readFile("./users.json", (err, data) => {
        if (err) throw err;
        const myDatabase = JSON.parse(data);
        let userToUpdate = myDatabase.find((elem) => elem.id === id);
        if (!userToUpdate) {
          reject(`No user with id ${id} found`);
        } else {
          myDatabase[myDatabase.findIndex((elem) => elem.id == id)] = {
            ...myDatabase[myDatabase.findIndex((elem) => elem.id == id)],
            username: username,
            age: age,
            hobbies: hobbies,
          };
          fs.writeFile("./users.json", JSON.stringify(myDatabase), (err) => {
            if (err) throw err;
            console.log("User updated");
          });
          resolve();
        }
      });
    });
  }

  async deleteUser(id) {
    return new Promise((resolve, reject) => {
      fs.readFile("./users.json", (err, data) => {
        if (err) throw err;
        const myDatabase = JSON.parse(data);
        let userToDelete = myDatabase.find((elem) => elem.id == id);

        if (!userToDelete) {
          reject(`No user with id ${id} found`);
        } else {
          let removalIndex = myDatabase.indexOf(userToDelete);
          myDatabase.splice(removalIndex, 1);
          fs.writeFile("./users.json", JSON.stringify(myDatabase), (err) => {
            if (err) throw err;
            console.log("User deleted");
            resolve();
          });
        }
      });
    });
  }
}
