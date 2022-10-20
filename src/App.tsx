import React, { useRef } from 'react';
import styles from './App.module.scss';
import madison from './Madison';
import { Capability, Divider, Education, Header, Period, Skill, TimeLines } from './components';
import { getScreenDevice, ScreenDevice } from './utils/device';
import useTimelineWidth from './hooks/useTimelineWidth';
import { defineMessages, useIntl } from 'react-intl';

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

const COLORS = ['var(--color-red)', 'var(--color-yellow)', 'var(--color-dark-yellow)', 'var(--color-dark-red)', 'var(--color-green)', '#FF66B2'];

function App() {
    const intl = useIntl();
    const { timelineWidth = 1000 } = useTimelineWidth();
    const { current: person } = useRef(madison);
    const periodColors: { [key: string]: string } = {};
    person?.periods?.forEach((p, index) => {
        periodColors[p.id] = COLORS[index];
    });
    return (
        <div className={styles.main}>
            <Header firstName={person.firstName} lastName={person.lastName} email={person.email} cellphone={person.cellphone} />
            <Divider title={intl.formatMessage(messages.profile)} />
            <section>
                <div className={styles.profile}>
                    <div className={styles.description}>
                        {person.description?.map(d => (
                            <div className={styles.descriptionItem}>{d}</div>
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
                    {person.skills?.map(skill => (
                        <Skill {...skill} key={skill.id} />
                    ))}
                </div>
            </section>
            <Divider
                title={intl.formatMessage(messages.professionalExperiences)}
                extra={getScreenDevice() === ScreenDevice.PC ? <TimeLines width={timelineWidth - 300} periods={person.periods} periodColors={periodColors} barPosition="bottom" /> : null}
            />
            <section>{getScreenDevice() !== ScreenDevice.PC ? <TimeLines width={timelineWidth - 20} periods={person.periods} periodColors={periodColors} barPosition="top" /> : null}</section>
            <section>
                {person.reversedPeriods?.map(period => (
                    <Period {...period} key={period.id} periodColor={periodColors[period?.id]} companyName={period?.company?.name} companyType={period?.company?.type} />
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
