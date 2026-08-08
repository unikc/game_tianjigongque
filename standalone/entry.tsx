import { createRoot } from "react-dom/client";
import Game from "../src/components/game/Game";
const el = document.getElementById("root");
if (el) createRoot(el).render(<Game />);
