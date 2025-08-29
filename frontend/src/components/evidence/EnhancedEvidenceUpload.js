import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  Progress,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  List,
  ListItem,
  ListIcon,
  useToast,
  Divider
} from '@chakra-ui/react';
import { 
  AddIcon,
  DeleteIcon, 
  CheckCircleIcon, 
  WarningIcon,
  AttachmentIcon 
} from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const EnhancedEvidenceUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    evidenceType: 'DOCUMENT',
    applicablePolicies: '',
    description: '',
    tags: '',
    questionnaireId: '',
    questionId: '',
    category: 'COMPLIANCE'
  });
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  
  const toast = useToast();

  const evidenceTypes = [
    { value: 'DOCUMENT', label: 'Document' },
    { value: 'SCREENSHOT', label: 'Screenshot' },
    { value: 'CERTIFICATE', label: 'Certificate' },
    { value: 'POLICY', label: 'Policy Document' },
    { value: 'AUDIT_REPORT', label: 'Audit Report' },
    { value: 'ASSESSMENT', label: 'Assessment' },
    { value: 'OTHER', label: 'Other' }
  ];

  const categories = [
    { value: 'COMPLIANCE', label: 'Compliance' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'PRIVACY', label: 'Privacy' },
    { value: 'OPERATIONAL', label: 'Operational' },
    { value: 'FINANCIAL', label: 'Financial' },
    { value: 'LEGAL', label: 'Legal' }
  ];

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast({
        title: 'Some files were rejected',
        description: 'Please check file size and type requirements',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    const formDataToSend = new FormData();

    // Add files
    files.forEach(fileObj => {
      formDataToSend.append('files', fileObj.file);
    });

    // Add metadata
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('/api/evidence/upload/multiple', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress({ overall: progress });
        }
      });

      setUploadResults(response.data);
      
      toast({
        title: 'Upload completed',
        description: `${response.data.successfulCount} files uploaded successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear files after successful upload
      setFiles([]);
      setUploadProgress({});

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload files',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Card>
        <CardHeader>
          <Heading size="lg">Enhanced Evidence Upload</Heading>
          <Text color="gray.600">
            Upload multiple evidence files with comprehensive metadata
          </Text>
        </CardHeader>
        
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Drag and Drop Zone */}
            <Box
              {...getRootProps()}
              border="2px dashed"
              borderColor={isDragActive ? "blue.400" : "gray.300"}
              borderRadius="lg"
              p={8}
              textAlign="center"
              cursor="pointer"
              bg={isDragActive ? "blue.50" : "gray.50"}
              transition="all 0.2s"
              _hover={{ borderColor: "blue.400", bg: "blue.50" }}
            >
              <input {...getInputProps()} />
              <VStack spacing={3}>
                <AttachmentIcon boxSize={12} color="gray.400" />
                <Text fontSize="lg" fontWeight="medium">
                  {isDragActive
                    ? "Drop files here..."
                    : "Drag & drop files here, or click to select"}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Supports PDF, DOC, DOCX, XLS, XLSX, Images, TXT, CSV (max 50MB each)
                </Text>
              </VStack>
            </Box>

            {/* File List */}
            {files.length > 0 && (
              <Box>
                <Text fontWeight="medium" mb={3}>
                  Selected Files ({files.length})
                </Text>
                <List spacing={2}>
                  {files.map((fileObj) => (
                    <ListItem key={fileObj.id}>
                      <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                        <HStack>
                          <ListIcon as={AttachmentIcon} color="blue.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">{fileObj.file.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                            </Text>
                          </VStack>
                        </HStack>
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeFile(fileObj.id)}
                          aria-label="Remove file"
                        />
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider />

            {/* Metadata Form */}
            <VStack spacing={4} align="stretch">
              <Heading size="md">Evidence Metadata</Heading>
              
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Evidence Type</FormLabel>
                  <Select
                    name="evidenceType"
                    value={formData.evidenceType}
                    onChange={handleInputChange}
                  >
                    {evidenceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Applicable Policies</FormLabel>
                <Input
                  name="applicablePolicies"
                  value={formData.applicablePolicies}
                  onChange={handleInputChange}
                  placeholder="e.g., ISO 27001, SOC 2, GDPR"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the evidence and its relevance"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="security, audit, compliance (comma-separated)"
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Questionnaire ID (Optional)</FormLabel>
                  <Input
                    name="questionnaireId"
                    value={formData.questionnaireId}
                    onChange={handleInputChange}
                    placeholder="Related questionnaire ID"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Question ID (Optional)</FormLabel>
                  <Input
                    name="questionId"
                    value={formData.questionId}
                    onChange={handleInputChange}
                    placeholder="Specific question ID"
                  />
                </FormControl>
              </HStack>
            </VStack>

            {/* Upload Progress */}
            {uploading && uploadProgress.overall !== undefined && (
              <Box>
                <Text mb={2}>Upload Progress</Text>
                <Progress value={uploadProgress.overall} colorScheme="blue" />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {uploadProgress.overall}% complete
                </Text>
              </Box>
            )}

            {/* Upload Results */}
            {uploadResults && (
              <Alert status={uploadResults.failedCount > 0 ? "warning" : "success"}>
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">{uploadResults.message}</Text>
                  <HStack spacing={4}>
                    <Badge colorScheme="green">
                      {uploadResults.successfulCount} successful
                    </Badge>
                    {uploadResults.failedCount > 0 && (
                      <Badge colorScheme="red">
                        {uploadResults.failedCount} failed
                      </Badge>
                    )}
                  </HStack>
                  {uploadResults.batchId && (
                    <Text fontSize="sm" color="gray.600">
                      Batch ID: {uploadResults.batchId}
                    </Text>
                  )}
                </VStack>
              </Alert>
            )}

            {/* Upload Button */}
            <Button
              colorScheme="blue"
              size="lg"
              onClick={uploadFiles}
              isLoading={uploading}
              loadingText="Uploading..."
              leftIcon={<AttachmentIcon />}
              isDisabled={files.length === 0}
            >
              Upload Evidence Files
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default EnhancedEvidenceUpload;
