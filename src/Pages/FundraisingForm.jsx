import React, { useState } from 'react';
import Axios from '../Config/Axios';
import {setFundraiseid} from"../Store/Reducers/fundraiseReducer"
import {useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Heart, 
  User, 
  MapPin, 
  Stethoscope, 
  Building2, 
  CreditCard, 
  Upload, 
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Camera,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Navigation from '../Components/Navigation';
import { Navigate } from 'react-router-dom';

const FundraisingForm = () => {
const navigate=useNavigate()
 const FundraiseState = useSelector((state) => state.fundraise.id);
  const dispatch = useDispatch();
  


  const [formData, setFormData] = useState({
    campaignTitle: '',
    description: '',
    patient: {
      fullName: '',
      age: '',
      gender: 'Male',
      location: {
        city: '',
        state: '',
        country: 'India'
      },
      contactNumber: ''
    },
    medical: {
      diagnosis: '',
      conditionDescription: '',
      hospital: {
        name: '',
        location: ''
      },
      doctorName: '',
      estimatedCost: '',
      currency: 'INR'
    },
    fundDetails: {
      targetAmount: '',
      deadline: '',
      reasonForHelp: ''
    },
    paymentInfo: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: ''
    },
    submittedBy: '',
    notes: ''
  });

  const [mediaFiles, setMediaFiles] = useState({
    photos: [],
    videoAppeal: null,
    medicalReports: [],
    costEstimates: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e, section, subsection) => {
    const { name, value } = e.target;

    if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: value
          }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e, field, multiple = false) => {
    const files = e.target.files;
    if (!files) return;

    setMediaFiles(prev => ({
      ...prev,
      [field]: multiple ? Array.from(files) : files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();

      // Append form data
      formDataToSend.append('campaignTitle', formData.campaignTitle);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('patient', JSON.stringify(formData.patient));
      formDataToSend.append('medical', JSON.stringify(formData.medical));
      formDataToSend.append('fundDetails', JSON.stringify(formData.fundDetails));
      formDataToSend.append('paymentInfo', JSON.stringify(formData.paymentInfo));
      formDataToSend.append('submittedBy', formData.submittedBy);
      formDataToSend.append('notes', formData.notes);

      // Append files
      mediaFiles.photos.forEach(file => formDataToSend.append('photos', file));
      mediaFiles.medicalReports.forEach(file => formDataToSend.append('medicalReports', file));
      mediaFiles.costEstimates.forEach(file => formDataToSend.append('costEstimates', file));
      if (mediaFiles.videoAppeal) {
        formDataToSend.append('videoAppeal', mediaFiles.videoAppeal);
      }

      const response = await Axios.post('https://arogya-backend-pjtu.onrender.com/user/raisefunds', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Campaign created:', response.data);
      if(response.data.success){

        dispatch(setFundraiseid(response.data.data._id))
        setSubmitStatus('success');
        navigate("/fundraisingprofile")
      }
      
      // Reset form after successful submission
     

    } catch (error) {
      console.error('Error creating campaign:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Campaign Info', icon: Heart },
    { id: 2, title: 'Patient Details', icon: User },
    { id: 3, title: 'Medical Info', icon: Stethoscope },
    { id: 4, title: 'Fund Details', icon: DollarSign },
    { id: 5, title: 'Payment Info', icon: CreditCard },
    { id: 6, title: 'Media & Submit', icon: Upload }
  ];

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <Navigation />
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${isActive ? 'bg-green-600 border-green-600 text-white' : 
                  isCompleted ? 'bg-green-100 border-green-600 text-green-600' : 
                  'bg-white border-gray-300 text-gray-400'}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Campaign Information</h2>
        <p className="text-gray-600 mt-2">Let's start with the basic details of your fundraising campaign</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Campaign Title *
        </label>
        <input
          type="text"
          name="campaignTitle"
          value={formData.campaignTitle}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter a compelling campaign title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Campaign Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Tell the story behind this campaign. Be detailed and heartfelt..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Submitted By *
        </label>
        <input
          type="text"
          name="submittedBy"
          value={formData.submittedBy}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Your name or organization"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
        <p className="text-gray-600 mt-2">Information about the patient who needs help</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.patient.fullName}
            onChange={(e) => handleInputChange(e, 'patient')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Patient's full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.patient.age}
            onChange={(e) => handleInputChange(e, 'patient')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Age"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.patient.gender}
            onChange={(e) => handleInputChange(e, 'patient')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.patient.contactNumber}
            onChange={(e) => handleInputChange(e, 'patient')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.patient.location.city}
            onChange={(e) => handleInputChange(e, 'patient', 'location')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.patient.location.state}
            onChange={(e) => handleInputChange(e, 'patient', 'location')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="State"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Stethoscope className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
        <p className="text-gray-600 mt-2">Details about the medical condition and treatment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Medical Diagnosis *
          </label>
          <input
            type="text"
            name="diagnosis"
            value={formData.medical.diagnosis}
            onChange={(e) => handleInputChange(e, 'medical')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Medical diagnosis"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Condition Description
          </label>
          <textarea
            name="conditionDescription"
            value={formData.medical.conditionDescription}
            onChange={(e) => handleInputChange(e, 'medical')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Detailed description of the medical condition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Hospital Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.medical.hospital.name}
            onChange={(e) => handleInputChange(e, 'medical', 'hospital')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Hospital name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hospital Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.medical.hospital.location}
            onChange={(e) => handleInputChange(e, 'medical', 'hospital')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Hospital location"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Doctor Name
          </label>
          <input
            type="text"
            name="doctorName"
            value={formData.medical.doctorName}
            onChange={(e) => handleInputChange(e, 'medical')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Attending doctor's name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estimated Cost *
          </label>
          <div className="flex">
            <select
              name="currency"
              value={formData.medical.currency}
              onChange={(e) => handleInputChange(e, 'medical')}
              className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <input
              type="number"
              name="estimatedCost"
              value={formData.medical.estimatedCost}
              onChange={(e) => handleInputChange(e, 'medical')}
              className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Medical Reports
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'medicalReports', true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Upload medical reports, test results, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cost Estimate Files
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'costEstimates', true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Upload cost estimates from hospital</p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Fund Details</h2>
        <p className="text-gray-600 mt-2">Set your fundraising goals and timeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target Amount *
          </label>
          <input
            type="number"
            name="targetAmount"
            value={formData.fundDetails.targetAmount}
            onChange={(e) => handleInputChange(e, 'fundDetails')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Target amount to raise"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Campaign Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.fundDetails.deadline}
            onChange={(e) => handleInputChange(e, 'fundDetails')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Reason for Help *
        </label>
        <textarea
          name="reasonForHelp"
          value={formData.fundDetails.reasonForHelp}
          onChange={(e) => handleInputChange(e, 'fundDetails')}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Explain why you need financial help and how the funds will be used"
          required
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
        <p className="text-gray-600 mt-2">Bank details for receiving donations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Holder Name
          </label>
          <input
            type="text"
            name="accountHolderName"
            value={formData.paymentInfo.accountHolderName}
            onChange={(e) => handleInputChange(e, 'paymentInfo')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Account holder name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.paymentInfo.bankName}
            onChange={(e) => handleInputChange(e, 'paymentInfo')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Bank name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.paymentInfo.accountNumber}
            onChange={(e) => handleInputChange(e, 'paymentInfo')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Account number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IFSC Code
          </label>
          <input
            type="text"
            name="ifscCode"
            value={formData.paymentInfo.ifscCode}
            onChange={(e) => handleInputChange(e, 'paymentInfo')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="IFSC code"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            UPI ID
          </label>
          <input
            type="text"
            name="upiId"
            value={formData.paymentInfo.upiId}
            onChange={(e) => handleInputChange(e, 'paymentInfo')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="yourname@upi"
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Upload className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Media & Final Details</h2>
        <p className="text-gray-600 mt-2">Add photos, videos and any additional notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-1" />
            Campaign Photos
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photos', true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Upload photos related to the campaign</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Video className="w-4 h-4 inline mr-1" />
            Video Appeal
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'videoAppeal')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Upload a video appeal (max size 10mb)</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Any additional information or special requests"
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">Campaign submitted successfully! Redirecting...</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">Error submitting campaign. Please try again.</span>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Create Fundraising Campaign</h1>
                <p className="text-green-100">Help save a life by creating a medical fundraising campaign</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {renderStepIndicator()}
            
            <div >
              {renderCurrentStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={(e)=>{handleSubmit(e)}}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Campaign'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundraisingForm;