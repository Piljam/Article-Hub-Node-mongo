const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.set('view engine','ejs')
const User = require('./model/user')
const Admin = require('./model/admin')
const Article = require('./model/article')
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const { render } = require('ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
mongoose.connect('mongodb://127.0.0.1:27017/my_new_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.get('/',(req,res)=>{
    res.render('login',{title:'login'})
})

app.get('/create',(req,res)=>{
    res.render('create',{title:'create'})
})

app.post('/create',async(req,res)=>{
    const{name,email,password} = req.body;
    const role = 'user'
    await User.create({name,email,password,role});
    res.redirect('/')
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari user di database
        const user = await User.findOne({ email: email });

        if (user && user.password === password) {
            if(user.role==='banned'){
                res.render('ban',{user})
            }
            res.render('userpage', { user }); // Login berhasil

        } else {
            res.send('Invalid email or password'); // Login gagal
        }
    } catch (err) {
        console.error(err);
        res.send('Something went wrong');
    }
});

app.get('/adminlogin',(req,res)=>{
    res.render('adminlogin',{title:"login for admin"})
})

app.get('/admincreate',(req,res)=>{
    res.render('createadmin',{title:"create admin"})
})

app.post('/admincreate',async(req,res)=>{
    const{adminname,adminemail,adminpassword} = req.body;
    const adminrole = 'admin'
    await Admin.create({adminname,adminemail,adminpassword,adminrole});
    res.redirect('/adminlogin')
})

app.post('/loginadmin', async (req, res) => {
    const { adminemail, adminpassword } = req.body;

    try {
        // Cari user di database
        const admin = await Admin.findOne({ adminemail: adminemail });

        if (admin && admin.adminpassword === adminpassword) {
            res.render('adminpage', { admin }); // Login berhasil
        } else {
            res.send('Invalid email or password'); // Login gagal
        }
    } catch (err) {
        console.error(err);
        res.send('Something went wrong');
    }
});
app.get('/readusers',async(req,res)=>{
    const users = await User.find()
    res.render('readusers',{users})
})

app.post('/readusers/delete/:id',async(req,res)=>{
    const userID=req.params.id;
    await User.findByIdAndDelete(userID)
    res.redirect('/readusers')
})

app.get('/addarticle/:id', async (req, res) => {
    const userId = req.params.id;  // Mengambil userId dari query parameter
  
    console.log('UserId received:', userId);  // Debug log
  
    const user = await User.findById(userId); // Menemukan user berdasarkan ID
  
    if (!user) {
      console.log('User not found with id:', userId);  // Debug log jika user tidak ditemukan
      return res.status(404).send('User not found');
    }
  
    res.render('addarticle', { user, title: 'Create Article' });  // Kirimkan user ke view
  });


app.post('/addarticle', async (req, res) => {
    const { title, content, userId } = req.body;  // Ambil userId dari body
  
    if (!title || !content || !userId) {
      return res.status(400).json({ message: 'Title, content, and userId are required' });
    }
  
    const user = await User.findById(userId);  // Cari user berdasarkan userId yang ada di body
  
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    const article = new Article({
      title,
      content,
      createdBy: user.name
    });
  
    await article.save();
    res.redirect('/');  // Ganti dengan rute yang sesuai, misalnya `/articles`
  });

  app.get('/readarticle',async(req,res)=>{
    const articles = await Article.find()
    res.render('readarticle',{articles})
})

app.get('/editprofile/:id',async(req,res)=>{
    const user = await User.findById(req.params.id)
    res.render('editprofile',{user})
})

app.put('/editprofile/:id',async(req,res)=>{
    const { name} = req.body;
    await User.findByIdAndUpdate(req.params.id, { name});
    res.redirect('/')
})

app.post('/ban/:id',async(req,res)=>{
    const role = 'banned'
    await User.findByIdAndUpdate(req.params.id, {role});
    res.redirect('/')
})

app.post('/unban/:id',async(req,res)=>{
    const role = 'user'
    await User.findByIdAndUpdate(req.params.id, {role});
    res.redirect('/')
})

app.get('/readarticleadmin',async(req,res)=>{
    const articles = await Article.find()
    res.render('readarticleadmin',{articles})
})

app.post('/readarticleadmin/deletearticle/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})
const PORT=3000
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
