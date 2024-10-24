import Image from 'next/image';
import Body from './components/body';
import { NavBar } from './components/navbar';

const HomePage = async () =>  {
	return (
		<>
			<NavBar />
			<Body />
		</>
	);
}

export default HomePage;