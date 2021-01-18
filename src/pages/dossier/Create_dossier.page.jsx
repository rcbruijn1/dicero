import React, { Fragment, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Prompt, useHistory, useLocation } from 'react-router-dom';

//Icons
import { Description, NoteAdd, RecordVoiceOver } from '@material-ui/icons';

// Core
import { Box, CircularProgress, Step, StepLabel, Stepper } from '@material-ui/core';
import { Main } from '../../components/layout';
import { CreateObservationFileForm, ObservationForm, OverviewForm } from '../../components/forms';

// GraphQl
import { GET_CLIENT_FORM_VALUES } from '../../graphql';

const GetClientFormValues = () => {
  const { loading, data } = useQuery(GET_CLIENT_FORM_VALUES, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return { loading: true, clientFormValues: [] };
  return (data && { loading: false, clientFormValues: data.getClients }) || [];
};

const CreateDossierPage = () => {
  const location = useLocation();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = param => {
    if (param) {
      history.push({ state: { id: param } });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const { clientFormValues, loading } = GetClientFormValues();

  const createDossierSteps = [
    {
      label: 'Dossier aanmaken',
      icon: <NoteAdd />,
    },
    {
      label: 'Observaties',
      icon: <RecordVoiceOver />,
    },
    {
      label: 'Dossier compleet melden',
      icon: <Description />,
    },
  ];


  const getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return <CreateObservationFileForm clients={clientFormValues} handleNext={handleNext} />;
      case 1:
        return <ObservationForm handleNext={handleNext} />;
      case 2:
        return <OverviewForm />;
      default:
        return 'Unknown';
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100%" ><CircularProgress color="secondary" /></Box>;

  return (
    <Fragment>

      <Main>
        <Stepper activeStep={activeStep} alternativeLabel>
          {createDossierSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                disabled
                style={{ fontSize: 6 }}
                icon={step.icon}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </Main>

      <Prompt
        message={promptLocation => {
          if ((promptLocation.pathname !== location.pathname) && activeStep !== 2) {
            return "Weet je zeker dat je de pagina wilt verlaten? Het dossier gaat mogelijk verloren.";
          }
          return null;
        }}
      />
    </Fragment>
  )
};

export default CreateDossierPage;