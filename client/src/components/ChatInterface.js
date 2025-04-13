import React from "react";
import { Box, Paper, Typography, Avatar, Fade, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function ChatInterface({ chatHistory, formatMessage }) {
  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      {chatHistory.map((msg, index) => {
        const isUser = msg.sender === "User";
        return (
          <Fade in timeout={300} key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 3,
              }}
            >
              {!isUser && (
                <Avatar sx={{ bgcolor: "#c5e1a5", mr: 1 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
              )}

              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  borderRadius: 4,
                  bgcolor: isUser ? "#e3f2fd" : "#f9fbe7",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#888", fontWeight: 500, mb: 0.5 }}
                >
                  {isUser ? "You" : "AI"}
                </Typography>
                <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                  {typeof msg.message === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(msg.message),
                      }}
                    />
                  ) : (
                    msg.message
                  )}
                </Typography>
              </Paper>

              {isUser && (
                <Avatar sx={{ bgcolor: "#90caf9", ml: 1 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </Box>
            
          </Fade>
        );
      })}
      <Divider />
    </Box>
  );
}
