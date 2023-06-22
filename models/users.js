const pool = require("../config/dbConfig");

const createNewUser = async (newUser) => {
  try {

    const addedUser = await pool.query(
      "INSERT INTO users (username, roles, password) VALUES ($1, $2, $3) RETURNING *",
      [newUser.username, JSON.stringify(newUser.roles), newUser.password]
    );
    
    return addedUser.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUser = async (username) => {
  try {
    const foundUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return foundUser.rows[0];

  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserWithRefreshToken = async (refreshToken) => {
    try {
      const foundUser = await pool.query(
        "SELECT * FROM users WHERE refreshtoken = $1",
        [refreshToken]
      );
      return foundUser.rows[0];
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

const updateRefreshToken = async (username, refreshToken) => {
    try {
        await pool.query(
            "UPDATE users SET refreshtoken =$1 WHERE username = $2",
            [refreshToken, username]
        );

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteRefreshToken = async (username) => {
    try {
        await pool.query(
            "UPDATE users SET refreshtoken =null WHERE username = $1",
            [username]
        );

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = { createNewUser, findUser, updateRefreshToken, findUserWithRefreshToken, deleteRefreshToken };
