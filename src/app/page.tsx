'use client'; 
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';

const projectTypes = ["Event Video", "Commercial", "Corporate Interview", "Product", "Training", "Advertising"];
const projectGoals = {
  "Event Video": ["Document an Event", "Increase Brand Awareness", "Entertain Viewers", "Showcase Highlights", "Engage Attendees Post-Event", "Create Social Media Recap", "Capture Testimonials"],
  "Commercial": ["Increase Brand Awareness", "Drive Sales", "Showcase Product/Service", "Create Social Media Engagement", "Educate About Brand", "Enhance Market Position", "Attract New Customers"],
  "Corporate Interview": ["Educate About Company", "Showcase Leadership", "Internal Communication", "Share Industry Insights", "Build Trust", "Provide Updates", "Create Web/Social Content"],
  "Product": ["Showcase Features/Benefits", "Drive Sales", "Educate on Usage", "Create Website Content", "Highlight Reviews", "Build Product Launch Anticipation", "Increase Brand Awareness"],
  "Training": ["Educate Employees/Clients", "Ensure Compliance", "Enhance Skills", "Provide Onboarding", "Create Training Resources", "Improve Employee Retention", "Track Progress"],
  "Advertising": ["Increase Brand Awareness", "Drive Sales", "Engage on Social Media", "Promote Offers", "Entertain Viewers", "Highlight USP", "Build Customer Loyalty"]
};
const services = { "Filming": { "Half Day": 2200, "Full Day": 4100 }, "Video + Photo Package": { "Half Day": 2700, "Full Day": 4600 } };
const editDurations = { "30 seconds": 250, "60 seconds": 450, "90 seconds": 650, "2 minutes": 750, "5 minutes": 1550 };
const deliverableTypes = ["Commercial", "YouTube Video", "Social Media Ad", "Corporate Video", "Product Demo", "Event Highlight", "Training Video", "Testimonial", "Explainer Video", "Brand Video"];
const preproductionServices = [
  { id: "scriptwriting", label: "Scriptwriting", description: "Professional scriptwriting to craft your message" },
  { id: "storyboarding", label: "Storyboarding", description: "Visual planning of shots and scenes" },
  { id: "locationScouting", label: "Location Scouting", description: "Finding and securing ideal filming locations" },
  { id: "talentCasting", label: "Talent Casting", description: "Selecting appropriate actors or presenters" },
  { id: "propsWardrobe", label: "Props and Wardrobe", description: "Arranging necessary items and clothing for the shoot" }
];

const VideoQuoteCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '', selectedGoals: [], projectDetails: '', serviceType: '', dayType: '',
    filmingDays: 1, edits: [{ duration: '', type: '' }], preproductionServices: [],
    quoteRequest: { name: '', email: '', phone: '', company: '', additionalInfo: '' }
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = formData.serviceType && formData.dayType ? services[formData.serviceType][formData.dayType] * formData.filmingDays : 0;
    formData.edits.forEach(edit => { if (edit.duration) price += editDurations[edit.duration] || 0; });
    price += formData.preproductionServices.length * 1200; // $1200 per preproduction service
    setTotalPrice(price);
  }, [formData]);

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleGoalChange = goal => updateFormData('selectedGoals', 
    formData.selectedGoals.includes(goal) ? formData.selectedGoals.filter(g => g !== goal) : [...formData.selectedGoals, goal]);
  const handleEditChange = (index, field, value) => {
    const newEdits = [...formData.edits];
    newEdits[index] = { ...newEdits[index], [field]: value };
    updateFormData('edits', newEdits);
  };
  const handlePreproductionChange = service => {
    const updatedServices = formData.preproductionServices.includes(service)
      ? formData.preproductionServices.filter(s => s !== service)
      : [...formData.preproductionServices, service];
    updateFormData('preproductionServices', updatedServices);
  };
  const handleQuoteRequestChange = e => {
    const { name, value } = e.target;
    updateFormData('quoteRequest', { ...formData.quoteRequest, [name]: value });
  };

  const renderStep = () => {
    const steps = [
      {
        title: "Project Type",
        content: (
          <Select value={formData.projectType} onValueChange={v => updateFormData('projectType', v)}>
            <SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger>
            <SelectContent>{projectTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
          </Select>
        )
      },
      {
        title: "Project Goals",
        content: (
          <div className="space-y-2">
            {formData.projectType && projectGoals[formData.projectType].map(goal => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox id={goal} checked={formData.selectedGoals.includes(goal)} onCheckedChange={() => handleGoalChange(goal)} />
                <Label htmlFor={goal}>{goal}</Label>
              </div>
            ))}
          </div>
        )
      },
      {
        title: "Tell us more about your project",
        content: <Textarea placeholder="Share details about your vision, target audience, key messages, or any specific requirements..." value={formData.projectDetails} onChange={e => updateFormData('projectDetails', e.target.value)} rows={5} />
      },
      {
        title: "Service Type",
        content: (
          <RadioGroup value={formData.serviceType} onValueChange={v => updateFormData('serviceType', v)}>
            {Object.keys(services).map(type => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} /><Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      },
      {
        title: "Filming Duration",
        content: (
          <RadioGroup value={formData.dayType} onValueChange={v => updateFormData('dayType', v)}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Half Day" id="half" /><Label htmlFor="half">Half Day</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Full Day" id="full" /><Label htmlFor="full">Full Day</Label></div>
          </RadioGroup>
        )
      },
      {
        title: "Filming Days",
        content: (
          <Select value={formData.filmingDays.toString()} onValueChange={v => updateFormData('filmingDays', Number(v))}>
            <SelectTrigger><SelectValue placeholder="Select days" /></SelectTrigger>
            <SelectContent>{[1, 2, 3, 4, 5].map(num => <SelectItem key={num} value={num.toString()}>{num}</SelectItem>)}</SelectContent>
          </Select>
        )
      },
      {
        title: "Final Deliverables",
        content: (
          <div className="space-y-4">
            {formData.edits.map((edit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select value={edit.duration} onValueChange={v => handleEditChange(index, 'duration', v)}>
                  <SelectTrigger><SelectValue placeholder="Duration" /></SelectTrigger>
                  <SelectContent>{Object.keys(editDurations).map(duration => <SelectItem key={duration} value={duration}>{duration}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={edit.type} onValueChange={v => handleEditChange(index, 'type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{deliverableTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => updateFormData('edits', formData.edits.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button onClick={() => updateFormData('edits', [...formData.edits, { duration: '', type: '' }])} variant="outline" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Edit</Button>
          </div>
        )
      },
      {
        title: "Pre-production Services",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Pre-production services help plan and prepare for your video project. Select the services you need:</p>
            {preproductionServices.map(service => (
              <div key={service.id} className="flex items-start space-x-2">
                <Checkbox id={service.id} checked={formData.preproductionServices.includes(service.id)} onCheckedChange={() => handlePreproductionChange(service.id)} />
                <div>
                  <Label htmlFor={service.id}>{service.label}</Label>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )
      },
      {
        title: "Estimated Price",
        content: (
          <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between"><span>Project Type:</span><span>{formData.projectType}</span></div>
            <div className="flex justify-between"><span>Service:</span><span>{formData.serviceType} - {formData.dayType}</span></div>
            <div className="flex justify-between"><span>Filming Days:</span><span>{formData.filmingDays}</span></div>
            <div className="flex justify-between font-semibold"><span>Base Cost:</span><span>${services[formData.serviceType]?.[formData.dayType] * formData.filmingDays || 0}</span></div>
            <div className="pt-2 border-t">
              <h4 className="font-semibold mb-2">Edits:</h4>
              {formData.edits.map((edit, index) => (
                <div key={index} className="flex justify-between">
                  <span>{edit.type} ({edit.duration})</span>
                  <span>${editDurations[edit.duration] || 0}</span>
                </div>
              ))}
            </div>
            {formData.preproductionServices.length > 0 && (
              <div className="pt-2 border-t">
                <h4 className="font-semibold mb-2">Pre-production Services:</h4>
                {formData.preproductionServices.map(service => (
                  <div key={service} className="flex justify-between">
                    <span>{preproductionServices.find(s => s.id === service).label}</span>
                    <span>$1200</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <span>Total Estimated Price:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )
      },
      {
        title: "Quote Request",
        content: (
          <form onSubmit={e => { e.preventDefault(); console.log('Quote Request Submitted:', { ...formData, totalPrice }); setStep(11); }} className="space-y-4">
            <Input name="name" placeholder="Name" value={formData.quoteRequest.name} onChange={handleQuoteRequestChange} required />
            <Input name="email" type="email" placeholder="Email" value={formData.quoteRequest.email} onChange={handleQuoteRequestChange} required />
            <Input name="phone" type="tel" placeholder="Phone" value={formData.quoteRequest.phone} onChange={handleQuoteRequestChange} required />
            <Input name="company" placeholder="Company Name" value={formData.quoteRequest.company} onChange={handleQuoteRequestChange} />
            <Textarea name="additionalInfo" placeholder="Additional Information" value={formData.quoteRequest.additionalInfo} onChange={handleQuoteRequestChange} />
            <Button type="submit" className="w-full">Submit Quote Request</Button>
          </form>
        )
      }
    ];

    return step > steps.length ? (
      <div className="text-center">
        <CardTitle className="text-2xl mb-4">Thank You!</CardTitle>
        <CardDescription className="text-lg">Your quote request has been submitted successfully. We'll be in touch shortly.</CardDescription>
      </div>
    ) : (
      <>
        <CardTitle>{steps[step - 1].title}</CardTitle>
        <CardDescription className="mt-2 mb-4">Step {step} of {steps.length}</CardDescription>
        <div className="mt-4">{steps[step - 1].content}</div>
      </>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Video Quote Calculator</CardTitle>
        <Progress value={(step / 10) * 100} className="w-full" />
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && step <= 10 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Previous</Button>}
        {step < 10 && <Button onClick={() => setStep(s => s + 1)}>Next</Button>}
      </CardFooter>
    </Card>
  );
};

export default VideoQuoteCalculator;
