const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
// تفعيل middleware لفهم البيانات بصيغة JSON
app.use(express.json());
// const { notFound, erorHandler } = require('./middleware/errors')
const  concatetodb  = require("./config/connact")
// const ejs = require('ejs');
app.use(cors()); 

concatetodb() 


//middleware
// app.use(loger) // تم تغيير هذا السطر

// app.set('view engine', 'ejs');    
// app.use(express.urlencoded({ extended: true }));

// تعريف واستخدام المسارات

app.use('/api/auth',require('./routes/authRoute'))
app.use('/api/users',require('./routes/userRoute'))
app.use('/api/posts',require('./routes/postRoute'))

//Erorr hanlder ùiddleware 

// app.use(notFound)

// app.use(erorHandler)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
