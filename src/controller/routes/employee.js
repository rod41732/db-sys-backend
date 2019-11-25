const EmployeeRouter = require('express').Router()
const EmployeeRepository = require('../../repository/employee.repo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// create employee
EmployeeRouter.post('/', async (req, res) => {
    try {
        const result = await EmployeeRepository.newEmployee(req.body);
        return res.send({
            id: result.insertId,
            message: 'OK',
        });
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        });
    }
})

EmployeeRouter.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(req.cookies.token);
    if (!username || !password) {
        return res.status(403).send({
            message: "No username or password specified",
        });
    }
    try {
        const user = (await EmployeeRepository.getEmployeesByUsername(username))[0];
        console.log('password', password, 'user', user);
        if (user && bcrypt.compareSync(password, user.Password)) {
            console.log('secret=',process.env.JWT_SECRET);
            const token = jwt.sign({
                Username: user.Username,
                FirstName: user.FirstName,
                IsManager: user.IsManager,
            }, process.env.JWT_SECRET);
            return res.cookie('token', token).status(200).send({
                message: 'OK',
            });
        }
        return res.status(403).send({
            message: 'Wrong password',
        })
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        });
    }
})

EmployeeRouter.get('/logout', (req, res) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(403).send({
            message: "No cookie",
        });

    }
    return res.clearCookie('token').send({
        message: 'OK',
    });
})

EmployeeRouter.get('/status', (req, res) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(403).send({
            message: "No cookie",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).send({
            message: 'OK',
            data: decoded,
        });
    } catch (err) {
        return res.status(403).send({
            message: 'Bad token',
        });
    }
});

module.exports = EmployeeRouter;

// EmployeeRouter.get('/status', (req, res) => {
//     console.lo
// })
