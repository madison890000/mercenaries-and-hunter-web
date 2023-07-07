import React, { useRef } from 'react';
import styles from './App.module.scss';
import madison from './Madison';
import { Capability, Divider, Education, Header, Period, Skill } from './components';
import { defineMessages, useIntl } from 'react-intl';
import capitalize from './utils/capitalize';
import DataModel from './models/types';

const messages = defineMessages({
    profile: {
        id: 'section.divider.profile',
        defaultMessage: 'Profile'
    },
    skills: {
        id: 'section.divider.skills',
        defaultMessage: 'Skills'
    },
    professionalExperiences: {
        id: 'section.divider.professionalExperiences'
    },
    educationExperiences: {
        id: 'section.divider.educationExperiences',
        defaultMessage: 'Education Experiences'
    }
});

function App() {
    const intl = useIntl();
    const { current: person } = useRef(madison);
    const periodColors: { [key: string]: string } = {};
    person?.periods?.forEach((p, index) => {
        periodColors[p.id] = index % 2 === 0 ? 'black' : '#1976d2';
    });
    return (
        <div className={styles.main}>
            <Header
                firstName={person.firstName}
                lastName={person.lastName}
                email={person.email}
                links={person.links}
                cellphone={person.cellphone}
                location={person.location}
                searchingFor={person.searchingFor}
            />
            <Divider title={intl.formatMessage(messages.profile)} />
            <section>
                <div className={styles.profile}>
                    <div className={styles.description}>
                        {person.descriptions?.map(d => (
                            <div className={styles.descriptionItem} key={d.id}>
                                {capitalize(d.toString())}
                            </div>
                        ))}
                    </div>
                    <div className={styles.capability}>
                        <Capability capabilities={person.capability} />
                    </div>
                </div>
            </section>
            <Divider title={intl.formatMessage(messages.skills)} />
            <section>
                <div className={styles.skills}>
                    {person.skills
                        ?.filter(s => s?.importance === DataModel.Importance.Essential)
                        ?.map(skill => (
                            <Skill {...skill} key={skill.id} />
                        ))}
                </div>
            </section>
            <Divider variant="dash" />
            <section>
                <div className={styles.skills}>
                    {person.skills
                        ?.filter(s => s?.importance === DataModel.Importance.Advanced)
                        ?.map(skill => (
                            <Skill size="small" {...skill} key={skill.id} />
                        ))}
                </div>
            </section>
            <Divider title={intl.formatMessage(messages.professionalExperiences)} />
            <section>
                {person.reversedPeriods?.map(period => (
                    <>
                        <Period
                            jobPositionLevel={period.job.level}
                            jobPosition={period.job.position}
                            keywords={period.keywords}
                            descriptions={period.descriptions}
                            key={period.id}
                            periodColor={periodColors[period?.id]}
                            companyName={period?.company?.name}
                            companyType={period.company.type}
                            companyIndustry={period.company.industry}
                            achievements={period.achievements}
                            start={period.start}
                            end={period.end}
                            jobSummaries={period.jobSummaries}
                            projects={period?.projects}
                        />
                    </>
                ))}
            </section>
            <Divider title={intl.formatMessage(messages.educationExperiences)} />
            <section>
                {person.educations?.map(education => (
                    <Education {...education} key={education.id} />
                ))}
            </section>
        </div>
    );
}

export default App;
