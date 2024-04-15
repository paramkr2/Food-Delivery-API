import app from './index'
import dbconnect from './db/db'
const port = process.env.PORT||8000;

dbconnect();

app.listen( port , ()=>{
	console.log(`server running at ${port}`)
});

export default app ;
