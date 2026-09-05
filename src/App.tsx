import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectsGallery } from './components/ProjectsGallery';
import { VideoShowcase } from './components/VideoShowcase';
import { ProjectModal } from './components/ProjectModal';
import { ServicesSection } from './components/ServicesSection';
import { MaterialsSection } from './components/MaterialsSection';
import { ProcessSection } from './components/ProcessSection';
import { BudgetSimulatorSection } from './components/BudgetSimulatorSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BudgetModal } from './components/BudgetModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminPanel } from './components/AdminPanel';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { Projeto, VideoItem, SiteSettings } from './types';
import { INITIAL_PROJECTS, INITIAL_VIDEOS, INITIAL_SETTINGS, INITIAL_GALLERY } from './data/initialData';

export default function App() {
  const [projects, setProjects] = useState<Projeto[]>(INITIAL_PROJECTS);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [photoGallery, setPhotoGallery] = useState<string[]>(INITIAL_GALLERY);
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('dashboard');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [preSelectedAmbiente, setPreSelectedAmbiente] = useState<string>('Cozinha');
  const [activeSection, setActiveSection] = useState('inicio');

  const fetchAppData = async () => {
    try {
      const [projRes, vidRes, setRes, galRes] = await Promise.all([
        fetch('/api/projects').then((r) => r.json()).catch(() => null),
        fetch('/api/videos').then((r) => r.json()).catch(() => null),
        fetch('/api/settings').then((r) => r.json()).catch(() => null),
        fetch('/api/gallery').then((r) => r.json()).catch(() => null),
      ]);

      if (Array.isArray(projRes) && projRes.length > 0) {
        setProjects(projRes);
      }
      if (Array.isArray(vidRes) && vidRes.length > 0) {
        setVideos(vidRes);
      }
      if (setRes && setRes.nomeEmpresa) {
        setSiteSettings(setRes);
      }
      if (Array.isArray(galRes) && galRes.length > 0) {
        setPhotoGallery(galRes);
      }
    } catch (err) {
      console.warn('Using client initial state:', err);
    }
  };

  useEffect(() => {
    fetchAppData();

    const handleScroll = () => {
      const sections = ['inicio', 'sobre', 'projetos', 'galeria', 'videos', 'servicos', 'materiais', 'orcamento', 'contato'];
      const scrollPos = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBudget = (ambiente?: string) => {
    if (ambiente) {
      setPreSelectedAmbiente(ambiente);
    }
    setIsBudgetModalOpen(true);
  };

  const handleOpenAdmin = (tab: string = 'dashboard') => {
    setAdminInitialTab(tab);
    setAdminActiveTab(tab);
    setIsAdminPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Fixed Luxury Navigation Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenBudget={() => handleOpenBudget()}
        onOpenAdmin={handleOpenAdmin}
        logoUrl={siteSettings.logoUrl}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section with High-Impact 3D Gold Typography and Real Stats */}
        <Hero
          onOpenBudget={() => handleOpenBudget()}
          onExploreProjects={() => handleNavigate('projetos')}
          settings={siteSettings}
        />

        {/* About the brand & high-end 100% MDF carpentry */}
        <AboutSection />

        {/* Dynamic Filterable Projects Gallery */}
        <ProjectsGallery
          projects={projects}
          onSelectProject={(p) => setSelectedProject(p)}
          onOpenBudget={(amb) => handleOpenBudget(amb)}
        />

        {/* Real Photos Gallery Showcase */}
        <PhotoGallerySection
          photos={photoGallery}
          onOpenBudget={(amb) => handleOpenBudget(amb)}
        />

        {/* Video Showcase & YouTube Embed Tours Section */}
        <VideoShowcase
          videos={videos}
          onOpenConfig={() => handleOpenAdmin('videos')}
          onOpenBudget={() => handleOpenBudget()}
        />

        {/* Services & Ambientes */}
        <ServicesSection onOpenBudget={(amb) => handleOpenBudget(amb)} />

        {/* Materials & MDF Textures Explorer */}
        <MaterialsSection />

        {/* 5-Step Execution Process */}
        <ProcessSection />

        {/* Interactive Budget Simulator */}
        <BudgetSimulatorSection onOpenModal={(amb) => handleOpenBudget(amb)} />

        {/* Real Customer Testimonials */}
        <TestimonialsSection />

        {/* Contact Form & Studio Location */}
        <ContactSection />
      </main>

      {/* Luxury Footer with Gold Monogram and Navigation */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBudget={() => handleOpenBudget()}
        onOpenAdmin={handleOpenAdmin}
        logoUrl={siteSettings.logoUrl}
      />

      {/* Modals & Triggers */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectForBudget={(title, cat) => handleOpenBudget(cat)}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        defaultAmbiente={preSelectedAmbiente}
        onBudgetCreated={() => {
          fetchAppData();
        }}
      />

      {/* Administrative Control Panel & CMS */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        initialTab={adminInitialTab}
        activeTab={adminActiveTab}
        onTabChange={setAdminActiveTab}
        onClose={() => setIsAdminPanelOpen(false)}
        onDataChanged={fetchAppData}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
