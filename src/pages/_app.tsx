import './_app.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { State, ctx } from '../context';

const App: AppType = ({ Component, pageProps }) => {
	return (
		<State.Provider value={ctx}>
			<Component {...pageProps} />;
		</State.Provider>
	);
};

export default App;
