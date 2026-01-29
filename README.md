"# kamala-api-v1" 
 
Simple Express + MongoDB backend with two models (`User`, `Pickle`) and OTP-based authentication flows. 
 
## Getting started 
 
1. **Install dependencies** 
   - Run `npm install` in the project root. 
 
2. **Configure environment** 
   - By default the app will connect to `mongodb://localhost:27017/kamala-api` and listen on port `4000`. 
   - You can override these with environment variables: 
     - `MONGODB_URI` 
     - `PORT` 
 
3. **Run the server** 
   - Development: `npm run dev` 
   - Production: `npm start` 
 
## API routes (base: `/api`) 
 
### Auth 
 
- `POST /signup`  
  - Body: `{ "phoneNumber": string, "name": string }`  
  - Behaviour: creates user (if needed) and sends OTP (logged to console). 
 
- `POST /signupconfirm`  
  - Body: `{ "phoneNumber": string, "otp": string }`  
  - Behaviour: verifies OTP and marks user as verified. 
 
- `POST /login`  
  - Body: `{ "phoneNumber": string }`  
  - Behaviour: sends OTP if user exists. 
 
- `POST /loginconfirm`  
  - Body: `{ "phoneNumber": string, "otp": string }`  
  - Behaviour: verifies OTP and returns user data. 
 
### Pickles 
 
- `GET /getAllPickles`  
  - Returns all pickles. 
 
- `GET /getPickle/:pickleSlug`  
  - Returns pickle by `pickleSlug`. 
