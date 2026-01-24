'use client';

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography, Grid, Container } from '@mui/material';
import { Download, Share2, X } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

interface CertificateProps {
  userName: string;
  projectTitle: string;
  projectId: string;
  completionDate: string;
  pointsEarned: number;
  score?: number;
  onClose?: () => void;
}

export default function Certificate({
  userName,
  projectTitle,
  projectId,
  completionDate,
  pointsEarned,
  score,
  onClose
}: CertificateProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    onClose?.();
  };

  const downloadPDF = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        pdf.save(`${projectTitle}-Certificate.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  const shareCertificate = async () => {
    const text = `I just completed "${projectTitle}" on Recertify and earned ${pointsEarned} points! 🎉 #Web3Learning #Blockchain`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificate of Completion',
          text: text,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Certificate link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textTransform: 'none',
          width: '100%'
        }}
      >
        View Certificate
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <X />
          </Button>
        </Box>

        <DialogContent sx={{ p: 3, pt: 4 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Certificate */}
            <Box
              ref={certificateRef}
              sx={{
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                border: '3px solid',
                borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
                }
              }}
            >
              {/* Decorative corners */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  width: 20,
                  height: 20,
                  border: '2px solid #667eea',
                  borderRight: 'none',
                  borderBottom: 'none'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  border: '2px solid #764ba2',
                  borderLeft: 'none',
                  borderBottom: 'none'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  width: 20,
                  height: 20,
                  border: '2px solid #764ba2',
                  borderRight: 'none',
                  borderTop: 'none'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  border: '2px solid #667eea',
                  borderLeft: 'none',
                  borderTop: 'none'
                }}
              />

              {/* Certificate Content */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Certificate of Completion
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    fontStyle: 'italic'
                  }}
                >
                  This is to certify that
                </Typography>

                {/* User Name */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '2rem',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    pb: 1,
                    letterSpacing: 1
                  }}
                >
                  {userName}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    fontStyle: 'italic'
                  }}
                >
                  has successfully completed the learning project
                </Typography>

                {/* Project Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: 'text.primary',
                    fontSize: '1.5rem'
                  }}
                >
                  "{projectTitle}"
                </Typography>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ my: 2 }}>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Points Earned
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          fontSize: '1.5rem'
                        }}
                      >
                        +{pointsEarned}
                      </Typography>
                    </Box>
                  </Grid>
                  {score && (
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Final Score
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            fontSize: '1.5rem'
                          }}
                        >
                          {score}%
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    mt: 4
                  }}
                >
                  Awarded on {formatDate(completionDate)}
                </Typography>

                {/* Footer */}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mt: 4,
                    fontSize: '0.75rem',
                    fontStyle: 'italic'
                  }}
                >
                  Recertify • Web3 Learning Platform • {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 4,
              justifyContent: 'center'
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadPDF}
              sx={{ textTransform: 'none' }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share2 />}
              onClick={shareCertificate}
              sx={{ textTransform: 'none' }}
            >
              Share
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
