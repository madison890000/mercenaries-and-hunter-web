import React, { useRef } from 'react';
import styles from './App.module.scss';
import madison from './Madison';
import Header from './components/Header';
import Skill from './components/Skill';
import Period from './components/Period';
import Education from './components/Education';
import Divider from './components/Divider';
import { getScreenDevice, ScreenDevice } from './utils/device';
import TimeLines from './components/TimeLines';
import Capability from './components/Capability';
import useTimelineWidth from './hooks/useTimelineWidth';

const COLORS = [
    'var(--color-red)',
    'var(--color-yellow)',
    'var(--color-dark-yellow)',
    'var(--color-dark-red)',
    'var(--color-green)',
    '#FF66B2',
]

function App() {
    const { timelineWidth = 1000 } = useTimelineWidth();
    const { current: person } = useRef(madison);
    const periodColors: { [key: string]: string } = {};
    person?.periods?.forEach((p, index) => {
        periodColors[p.id] = COLORS[index];
    })

    return (
        <div className={styles.main}>
            <Header
                firstName={person.firstName}
                lastName={person.lastName}
                email={person.email}
                cellphone={person.cellphone}
            />
            <Divider title="Profile" />
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
            <Divider title="Skills" />
            <section>
                <div className={styles.skills}>
                    {person.skills?.map(skill => (
                        <Skill {...skill} />
                    ))}
                </div>
            </section>
            <Divider
                title="Professional Experiences"
                extra={
                    getScreenDevice() === ScreenDevice.PC ?
                        <TimeLines
                            width={timelineWidth - 300}
                            periods={person.periods}
                            periodColors={periodColors}
                            barPosition="bottom"
                        />
                        : null
                }
            />
            <section>
                {
                    getScreenDevice() !== ScreenDevice.PC ? <TimeLines
                        width={timelineWidth - 20}
                        periods={person.periods}
                        periodColors={periodColors}
                        barPosition="top"
                    /> : null
                }
            </section>
            <section>
                {person.reversedPeriods?.map(period => (
                    <Period
                        {...period}
                        periodColor={periodColors[period?.id]}
                        companyName={period?.company?.name}
                        companyType={period?.company?.type}
                    />
                ))}
            </section>
            <Divider title="Education Experiences" />
            <section>
                {person.educations?.map(education => (
                    <Education {...education} />
                ))}
            </section>
        </div>
    );
}

export default App;
