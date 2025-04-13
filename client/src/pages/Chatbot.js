import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Box,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import DevicesIcon from "@mui/icons-material/Devices";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import LayersIcon from "@mui/icons-material/Layers";
import ExtensionIcon from "@mui/icons-material/Extension";
import GoogleIcon from "@mui/icons-material/Google";
import  ChatInterface  from "../components/ChatInterface";  
 
export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const formatMessage = (message) => {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />")
      .replace(/(\d+)\.\s+(.*?)(?=<br>|$)/g, "<p><strong>$1.</strong> $2</p>")
      .replace(/- (.*?)(?=<br>|$)/g, "<li>$1</li>")
      .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>");
  };

  const handleAction = async (action) => {
    if (!query && action !== "upload") return;

    if (action === "upload") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "application/pdf";
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:8000/upload_pdf", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        setChatHistory(prev => [...prev, { sender: "User", message: "Uploaded PDF" }, { sender: "AI", message: JSON.stringify(result) }]);
      };
      fileInput.click();
    } else {
      const formData = new FormData();
      formData.append("query", query);
      const res = await fetch(`http://localhost:8000/${action}`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log(result)
      setChatHistory(prev => [...prev, { sender: "User", message: query }, { sender: "AI", message: result.answer || JSON.stringify(result) }]);
      setQuery("");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#fff", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: "1px solid #ddd" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" startIcon={<AddIcon />}>New</Button>
            <Button color="inherit">Home</Button>
            <Button variant="contained" sx={{ bgcolor: "#000", color: "#fff", borderRadius: 2, px: 2 }}>Logout</Button>
            <Button variant="outlined" startIcon={<GoogleIcon />} sx={{ borderRadius: 2, px: 2 }}>Login with Google</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h4" fontWeight={700}>Welcome to EduVersity2.0</Typography>

        <Paper elevation={3} sx={{ mt: 4, width: "60%", mx: "auto", borderRadius: 3, p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Message Blackbox or @mention agent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAction("summarize");
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 2, mt: 2 }}>
            <Button startIcon={<TravelExploreIcon />} sx={{ textTransform: "none" }} onClick={() => handleAction("ask")}>Ask Pdf</Button>
            <Button startIcon={<DevicesIcon />} sx={{ textTransform: "none" }} onClick={() => handleAction("generateQuiz")}>Generate Quiz</Button>
            <Button startIcon={<LayersIcon />} sx={{ textTransform: "none" }} onClick={() => handleAction("prepareReport")}>Report Generation</Button>
            <Button startIcon={<FlashOnIcon />} sx={{ textTransform: "none" }} onClick={() => handleAction("think")}>Think</Button>
            <Button startIcon={<ImageIcon />} sx={{ textTransform: "none" }} onClick={() => handleAction("image-gen")}>Image Gen</Button>
            <Button startIcon={<UploadIcon />} sx={{ textTransform: "none" }} onClick={() => handleAction("upload")}>Upload</Button>
          </Box>
        </Paper>
        <Box> 
           <ChatInterface chatHistory={chatHistory} formatMessage={formatMessage} /></Box>
       </Box>
    </Box>
  );
}
