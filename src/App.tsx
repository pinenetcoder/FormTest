import { styled } from "@mui/material";
import { BankTransferForm } from "./components/forms/bankTransferForm";

function App() {
  return (
    <StyledMain>
      <BankTransferForm />
    </StyledMain>
  );
}

const StyledMain = styled("main")({
  background: "#c1bdba",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default App;
