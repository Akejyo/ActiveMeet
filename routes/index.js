import homeRouter from './home.js';
import postRouter from './posts.js';
import profileRouter from './profile.js';
import reportRouter from './report.js';
import followingRouter from './following.js';

const constructorMethod = (app) =>{
  app.use("/", homeRouter);
  app.use("/posts", postRouter);
  app.use("/profile", profileRouter);
  app.use("/report", reportRouter);
  app.use("/following", followingRouter);

  app.use(/(.*)/, (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
}

export default constructorMethod;