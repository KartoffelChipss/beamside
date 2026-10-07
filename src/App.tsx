import { Button } from "./components/ui/button";
import { useSystemTheme } from "./hooks/useSystemTheme";

const App = () => {
    useSystemTheme();

    return (
        <>
            <h1>Beamerr</h1>
            <Button variant="default">Default</Button>
        </>
    );
};

export default App;
