module.exports = async(app, opts) => {
    app.get("/", async(req, res) => {
        return res.view("sample.ejs")
    })

    app.get("/registration", async(req, res) => {
        return res.view("reg.ejs")
    })
}