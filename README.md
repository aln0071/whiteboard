# CWB

CWB is an online collaborative whiteboard that allows many users to draw simultaneously on a large virtual board.
The board is updated in real time for all connected users, and its state is always persisted. This whiteboard is tailored for teaching purpose and has a dashboard to manage the boards. Using this dashboard, the teacher can perform various actions like creating whiteboards, sharing boards with specific access rights, view different statistics related to the board which helps in attendance tracking, and publishing realtime quizes.

## Screenshots

<table>
 <tr>
  <td> A simple board
  <td> <img width="300" src="https://user-images.githubusercontent.com/552629/59885574-06e02b80-93bc-11e9-9150-0670a1c5d4f3.png">
  <td> Collaborative diagram editing
  <td> <img alt="Screenshot of WBO's user interface: architecture" width="300" src="https://user-images.githubusercontent.com/552629/59915054-07101380-941c-11e9-97c9-4980f50d302a.png" />
  
  <tr>
   <td> Teaching math on <b>CWB</b>
   <td> <img alt="wbo teaching" width="300" src="https://user-images.githubusercontent.com/552629/59915737-a386e580-941d-11e9-81ff-db9e37f140db.png" />
   <td> Drawing art
   <td> <img alt="kawai cats on WBO" width="300" src="https://user-images.githubusercontent.com/552629/120919822-dc2c3200-c6bb-11eb-94cd-57a4254fbe0a.png"/>
</table>

## Running the application

To run this application, clone this repository. For uploading user images to the AWS S3 bucket, the following file has to be added:

`microservices/frontend/src/components/private-dashboard/profile/aws_config.js`

For the ChatGPT chatbot support, the following file has to be added:

`microservices/.env_chatgpt`

These files are shared in this [google drive link](https://drive.google.com/drive/folders/1olunZiCVJLKWEXCf0dqfaMXoWITuAVeE?usp=share_link).

After these environment files are setup, from the root directory, run the following command:

`docker compose up --build`

This will create the required docker containers and run the application. The application can now be accessed on [http://localhost:2000/](http://localhost:2000/).
