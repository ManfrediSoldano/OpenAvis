import BloodPlasmaBanner from "./BloodPlasmaBanner";

const ProspectiveDonorsPage: React.FC = () => {
  return (
    <>
      <BloodPlasmaBanner
        title="Diventa un Aspirante Donatore"
        description="Scopri come iniziare il tuo percorso per salvare vite umane."
      />
      <div style={{ textAlign: "center", maxWidth: '1200px', margin: '0 auto 3rem auto', padding: '0 1.5rem' }}>
        <p>Information for those interested in becoming blood donors.</p>
      </div>
    </>
  );
};

export default ProspectiveDonorsPage;
