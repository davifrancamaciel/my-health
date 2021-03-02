import Sequelize, { Model } from 'sequelize'
import { isBefore, subHours } from 'date-fns'

class Appointment extends Model {
    static init (sequelize) {
        super.init(
            {
                user_id: Sequelize.NUMBER,
                provider_id: Sequelize.NUMBER,
                speciality_id: Sequelize.NUMBER,
                date: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
                past: {
                    type: Sequelize.VIRTUAL,
                    get () {
                        return isBefore(this.date, new Date())
                    },
                },
                cancelable: {
                    type: Sequelize.VIRTUAL,
                    get () {
                        return isBefore(new Date(), subHours(this.date, 2))
                    },
                },
            },
            { sequelize }
        )

        return this
    }
    static associate (models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsTo(models.User, {
            foreignKey: 'provider_id',
            as: 'provider',
        })
        this.belongsTo(models.Speciality, { foreignKey: 'speciality_id', as: 'speciality' })
    }
}
export default Appointment
